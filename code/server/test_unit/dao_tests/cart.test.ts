import { Database as SQLite3Database} from 'sqlite3';
import CartDAO from "../../src/dao/cartDAO";
import { ProductNotInCartError } from "../../src/errors/cartError";
import { ProductNotFoundError } from "../../src/errors/productError";

jest.mock('sqlite3', () => {
    const mockRun = jest.fn();
    const mockGet = jest.fn();
    const mockAll = jest.fn();

    class MockDatabase {
        run(sql: string, params: any[], callback: (err: any) => void) {
            mockRun(sql, params, callback);
        }

        get(sql: string, params: any[], callback: (err: any, row: any) => void) {
            mockGet(sql, params, callback);
        }

        all(sql: string, params: any[], callback: (err: any, rows: any) => void) {
            mockAll(sql, params, callback);
        }
    }

    return { Database: MockDatabase };
});

describe("CartDAO Tests", () => {
    let cartDAO: CartDAO;
    let mockRun: jest.Mock;
    let mockGet: jest.Mock;
    let mockAll: jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks(); // Reset all mocks before each test
        cartDAO = new CartDAO();
        mockRun = jest.fn();
        mockGet = jest.fn();
        mockAll = jest.fn();
        (SQLite3Database.prototype as any).run = mockRun;
        (SQLite3Database.prototype as any).get = mockGet;
        (SQLite3Database.prototype as any).all = mockAll;
    });

    test("should add a product to the cart successfully", async () => {
        const mockProduct = { model: "Model1", sellingPrice: 499.99, category: "Smartphone" };
        mockGet
            .mockImplementationOnce((sql, params, callback) => callback(null, null)) // Cart not found initially
            .mockImplementationOnce((sql, params, callback) => callback(null, mockProduct)) // Product found
            .mockImplementationOnce((sql, params, callback) => callback(null, null)); // Product not in cart initially
        mockRun.mockImplementation((sql, params, callback) => callback(null));

        await cartDAO.addProductToCart("user1", "Model1");

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM carts WHERE username = ? AND paid = 0`,
            ["user1"],
            expect.any(Function)
        );
        expect(mockRun).toHaveBeenCalledWith(
            `INSERT INTO carts (username, paid, paymentDate, total) VALUES (?, 0, "", 0)`,
            ["user1"],
            expect.any(Function)
        );
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE username = ? AND paid = 0) AND model = ?`,
            ["user1", "Model1"],
            expect.any(Function)
        );
        expect(mockRun).toHaveBeenCalledWith(
            `INSERT INTO cart_items (cart_id, model, quantity, price, category) VALUES ((SELECT id FROM carts WHERE username = ? AND paid = 0), ?, 1, ?, ?)`,
            ["user1", "Model1", 499.99, "Smartphone"],
            expect.any(Function)
        );
    });

    test("should update the quantity of an existing product in the cart", async () => {
        const mockProduct = { model: "Model1", sellingPrice: 499.99, category: "Smartphone" };
        const mockExistingProduct = { cart_id: 1, model: "Model1", quantity: 1 };
        mockGet
            .mockImplementationOnce((sql, params, callback) => callback(null, { id: 1 })) // Cart found
            .mockImplementationOnce((sql, params, callback) => callback(null, mockProduct)) // Product found
            .mockImplementationOnce((sql, params, callback) => callback(null, mockExistingProduct)); // Product already in cart
        mockRun.mockImplementation((sql, params, callback) => callback(null));

        await cartDAO.addProductToCart("user1", "Model1");

        expect(mockRun).toHaveBeenCalledWith(
            `UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = ? AND model = ?`,
            [1, "Model1"],
            expect.any(Function)
        );
    });

    test("should throw ProductNotFoundError when adding a non-existing product", async () => {
        mockGet
            .mockImplementationOnce((sql, params, callback) => callback(null, { id: 1 })) // Cart found
            .mockImplementationOnce((sql, params, callback) => callback(null, null)); // Product not found

        await expect(cartDAO.addProductToCart("user1", "InvalidModel")).rejects.toThrow(ProductNotFoundError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["InvalidModel"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });

    test("should remove a product from the cart successfully", async () => {
        const mockProductInCart = { cart_id: 1, model: "Model1", quantity: 1 };
        mockGet
            .mockImplementationOnce((sql, params, callback) => callback(null, { id: 1 })) // Cart found
            .mockImplementationOnce((sql, params, callback) => callback(null, mockProductInCart)); // Product in cart
        mockRun.mockImplementation((sql, params, callback) => callback(null));

        await cartDAO.removeProductFromCart("user1", "Model1");

        expect(mockRun).toHaveBeenCalledWith(
            `DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE username = ? AND paid = 0) AND model = ?`,
            ["user1", "Model1"],
            expect.any(Function)
        );
    });

    test("should decrement the quantity of a product in the cart", async () => {
        const mockProductInCart = { cart_id: 1, model: "Model1", quantity: 2 };
        mockGet
            .mockImplementationOnce((sql, params, callback) => callback(null, { id: 1 })) // Cart found
            .mockImplementationOnce((sql, params, callback) => callback(null, mockProductInCart)); // Product in cart
        mockRun.mockImplementation((sql, params, callback) => callback(null));

        await cartDAO.removeProductFromCart("user1", "Model1");

        expect(mockRun).toHaveBeenCalledWith(
            `UPDATE cart_items SET quantity = quantity - 1 WHERE cart_id = ? AND model = ?`,
            [1, "Model1"],
            expect.any(Function)
        );
    });

    test("should throw ProductNotFoundError when removing a non-existing product", async () => {
        mockGet.mockImplementation((sql, params, callback) => callback(null, null)); // Product not found

        await expect(cartDAO.removeProductFromCart("user1", "InvalidModel")).rejects.toThrow(ProductNotFoundError);

        expect(mockRun).not.toHaveBeenCalled();
    });

    test("should throw ProductNotInCartError when removing a product not in the cart", async () => {
        const mockProduct = { model: "Model1" };
        
        mockGet
            .mockImplementationOnce((sql, params, callback) => callback(null, mockProduct)) // Product found
            .mockImplementationOnce((sql, params, callback) => callback(null, null)); // Product not in cart
    
        await expect(cartDAO.removeProductFromCart("user1", "Model1")).rejects.toThrow(ProductNotInCartError);
    
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM cart_items WHERE model = ? AND cart_id = (SELECT id FROM carts WHERE username = ? AND paid = 0)`,
            ["Model1", "user1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });
    
    
    test("should get the current cart successfully", async () => {
        const mockCart = { id: 1, username: "user1", paid: 0, paymentDate: "", total: 0 };
        const mockProducts: any[] = []; 
    
        mockGet.mockImplementationOnce((sql, params, callback) => callback(null, mockCart));
        mockAll.mockImplementation((sql, params, callback) => callback(null, mockProducts));
    
        const cart = await cartDAO.getCurrentCart("user1");
    
        expect(cart).toEqual({
            customer: "user1",
            paid: 0,
            paymentDate: "",
            total: 0,
            products: []
        });
    
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM carts WHERE username = ? AND paid = 0`,
            ["user1"],
            expect.any(Function)
        );
        expect(mockAll).toHaveBeenCalledWith(
            `SELECT * FROM cart_items WHERE cart_id = ?`,
            [1],
            expect.any(Function)
        );
    });
    
});
