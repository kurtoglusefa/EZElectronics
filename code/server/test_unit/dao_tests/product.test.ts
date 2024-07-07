import { Database as SQLite3Database} from 'sqlite3';
import ProductDAO from "../../src/dao/productDAO";
import { ProductNotFoundError, ProductAlreadyExistsError, EmptyProductStockError, LowProductStockError, ValidationError } from "../../src/errors/productError";
import { DateError } from "../../src/utilities";


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

        all(sql: string, params: any[], callback: (err: any, row: any) => void) {
            mockAll(sql, params, callback);
        }

    }

    return { Database: MockDatabase };
});

describe('ProductDAO', () => {
    let productDAO: ProductDAO;
    let mockRun: jest.Mock;
    let mockGet: jest.Mock;
    let mockAll: jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks(); // Reset all mocks before each test
        productDAO = new ProductDAO();
        mockRun = jest.fn();
        mockGet = jest.fn();
        mockAll = jest.fn();
        (SQLite3Database.prototype as any).run = mockRun;
        (SQLite3Database.prototype as any).get = mockGet;
        (SQLite3Database.prototype as any).all = mockAll;
    });

    ////////////////// TESTS FOR ADD PRODUCT/////////////////////////
    test("should add a product successfully", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, null);
        });
        mockRun.mockImplementation((sql: string, params: any[], callback: (err: any) => void) => {
            callback(null);
        });

        await productDAO.addProduct("Model1", "Smartphone", "2023-01-01", 499.99, 10, "Details");

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).toHaveBeenCalledWith(
            `INSERT INTO product_descriptors (model, category, arrivalDate, sellingPrice, quantity, details) VALUES (?, ?, ?, ?, ?, ?)`,
            ["Model1", "Smartphone", "2023-01-01", 499.99, 10, "Details"],
            expect.any(Function)
        );
    });

    test("should throw ProductAlreadyExistsError when adding an existing product", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, {});
        });

        await expect(productDAO.addProduct("Model1", "Smartphone", "2023-01-01", 499.99, 10, "Details"))
            .rejects
            .toThrow(ProductAlreadyExistsError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });

    test("should throw DateError when date is after current date", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, null);
        });

        await expect(productDAO.addProduct("Model1", "Smartphone", "2025-01-01", 499.99, 10, "Details"))
            .rejects
            .toThrow(DateError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });

    test("should throw ValidationError when quantity is negative", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, null);
        });

        await expect(productDAO.addProduct("Model1", "Smartphone", "2023-01-01", 499.99, -2, "Details"))
            .rejects
            .toThrow(ValidationError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });

     ///////////////// TESTS FOR CHANGE PRODUCT QUANTITY/////////////////////////
     test("should change product quantity successfully", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 5 });
        });
        mockRun.mockImplementation((sql: string, params: any[], callback: (err: any) => void) => {
            callback(null);
        });

        const newQuantity = await productDAO.changeProductQuantity("Model1", 5, "2023-01-02");

        expect(newQuantity).toBe(10);
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).toHaveBeenCalledWith(
            `UPDATE product_descriptors SET quantity = quantity + ?, arrivalDate = ? WHERE model = ?`,
            [5, "2023-01-02", "Model1"],
            expect.any(Function)
        );
    });

    test('should throw ProductNotFoundError when changing quantity for a non-existing product', async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, null);
        });

        await expect(productDAO.changeProductQuantity("Model1", 5, "2023-01-02"))
            .rejects
            .toThrow(ProductNotFoundError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });

    test('should throw DateError when changing quantity with date after current date', async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 5 });
        });

        await expect(productDAO.changeProductQuantity("Model1", 5, "2025-01-02"))
            .rejects
            .toThrow(DateError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });

    test('should throw DateError when changing quantity with date before arrival date', async () => {
        mockGet.mockImplementation((sql, params, callback) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 5 });
        });

        await expect(productDAO.changeProductQuantity("Model1", 5, "2021-01-02"))
            .rejects
            .toThrow(DateError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });

    ///////////////// TESTS FOR SELL PRODUCT /////////////////////////
    test("should sell a product successfully", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 10 });
        });
        mockRun.mockImplementation((sql: string, params: any[], callback: (err: any) => void) => {
            callback(null);
        });
    
        const soldQuantity = 5;
        const sellingDate = "2023-01-02";
        const remainingQuantity = await productDAO.sellProduct("Model1", soldQuantity, sellingDate);
    
        expect(remainingQuantity).toBe(5);
    
        expect(mockRun).toHaveBeenCalledWith(
            `UPDATE product_descriptors SET quantity = quantity - ?, arrivalDate = ? WHERE model = ?`,
            [soldQuantity, sellingDate, "Model1"],
            expect.any(Function)
        );
    })


    test("should throw ProductNotFoundError when selling a non-existing product", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any) => void) => {
            callback(null);
        });
    
        await expect(productDAO.sellProduct("Model1", 5, "2023-01-02"))
        .rejects
        .toThrow(ProductNotFoundError);
    
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    })
    
    test("should throw EmptyProductStockError when trying to sell a product with zero quantity", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 0 });
        });

        await expect(productDAO.sellProduct("Model1", 5, "2023-01-02"))
        .rejects
        .toThrow(EmptyProductStockError);
    
        expect(mockGet).toHaveBeenCalledWith(
             `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    })
    
    test("should throw LowProductStockError when trying to sell more quantity than available", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 2 });
        });

        await expect(productDAO.sellProduct("Model1", 10, "2023-01-02"))
        .rejects
        .toThrow(LowProductStockError);
    
        expect(mockGet).toHaveBeenCalledWith(
             `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
    
        expect(mockRun).not.toHaveBeenCalled();
    })
    
    test("should throw ValidationError when selling with negative quantity", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 2});
        });

        await expect(productDAO.sellProduct("Model1", -1, "2023-01-02"))
        .rejects
        .toThrow(ValidationError);
    
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
           ["Model1"],
           expect.any(Function)
       );
   
       expect(mockRun).not.toHaveBeenCalled();
    })
    
    test("should throw DateError when selling with invalid selling date", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 12 });
        });

        await expect(productDAO.sellProduct("Model1", 5, "2020-02-01"))
        .rejects
        .toThrow(DateError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    })

    ///////////////// TESTS FOR GET PRODUCTS /////////////////////////
    test("should fetch products by category successfully", async () => {
        const mockRows = [
            { model: "Model1", category: "Smartphone", arrivalDate: "2023-01-01", sellingPrice: 599.99, quantity: 12, details: "details1" },
            { model: "Model2", category: "Laptop", arrivalDate: "2023-03-07", sellingPrice: 899.99, quantity: 8, details: "details2" }
        ];

        mockAll.mockImplementation((sql: string, params: any[], callback: (err: any, rows: any[]) => void) => {
            callback(null, mockRows);
        });

        const testProduct1 = {
            model: "Model1",
            category: "Smartphone",
            arrivalDate: "2023-01-01",
            sellingPrice: 599.99,
            quantity: 12,
            details: "details1"
        };
        
        const result = await productDAO.getProducts('category', 'Smartphone', null);

        expect(result).toEqual(mockRows);
        expect(mockAll).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE category = ?`,
            ['Smartphone'],
            expect.any(Function)
        );
    })

    test("should fetch products by model successfully", async () => {
        const mockRows = [
            { model: "Model1", category: "Smartphone", arrivalDate: "2023-01-01", sellingPrice: 599.99, quantity: 12, details: "details1" },
            { model: "Model2", category: "Laptop", arrivalDate: "2023-03-07", sellingPrice: 899.99, quantity: 8, details: "details2" }
        ];

        mockAll.mockImplementation((sql: string, params: any[], callback: (err: any, rows: any[]) => void) => {
            callback(null, mockRows);
        });

        const testProduct1 = {
            model: "Model1",
            category: "Smartphone",
            arrivalDate: "2023-01-01",
            sellingPrice: 599.99,
            quantity: 12,
            details: "details1"
        };
        
        const result = await productDAO.getProducts('model', null, 'Model1');

        expect(result).toEqual(mockRows);
        expect(mockAll).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ['Model1'],
            expect.any(Function)
        );
    })

    test("should throw ValidationError when grouping is null but category or model is not null", async () => {
        await expect(productDAO.getProducts(null, 'Smartphone', null)).rejects.toThrow(ValidationError);
        await expect(productDAO.getProducts(null, null, 'Model1')).rejects.toThrow(ValidationError);
    })

    test("should throw ValidationError when grouping is category but category is null or model is not null", async () => {
        await expect(productDAO.getProducts('category', null, null)).rejects.toThrow(ValidationError);
        await expect(productDAO.getProducts('category', 'Smartphone', 'Model1')).rejects.toThrow(ValidationError);
    })

    test("should throw ValidationError when category is invalid", async () => {
        await expect(productDAO.getProducts('category', 'InvalidCategory', null)).rejects.toThrow(ValidationError);
    })

    test("should throw ValidationError when grouping is model but model is null or category is not null", async () => {
        await expect(productDAO.getProducts('model', null, null)).rejects.toThrow(ValidationError);
        await expect(productDAO.getProducts('model', 'Smartphone', 'Model1')).rejects.toThrow(ValidationError);
    })

    test("should throw Error for invalid grouping parameter", async () => {
        await expect(productDAO.getProducts('invalidGrouping', null, null)).rejects.toThrow(Error);
    })

    ///////////////// TESTS FOR GET AVAILABLE PRODUCTS /////////////////////////
    test("should fetch available products by category successfully", async () => {
        const mockRows = [
            { model: "Model1", category: "Smartphone", arrivalDate: "2023-01-01", sellingPrice: 599.99, quantity: 12, details: "details1" },
            { model: "Model2", category: "Laptop", arrivalDate: "2023-03-07", sellingPrice: 899.99, quantity: 8, details: "details2" }
        ];

        mockAll.mockImplementation((sql: string, params: any[], callback: (err: any, rows: any[]) => void) => {
            callback(null, mockRows);
        });

        const testProduct1 = {
            model: "Model1",
            category: "Smartphone",
            arrivalDate: "2023-01-01",
            sellingPrice: 599.99,
            quantity: 12,
            details: "details1"
        };
        
        const result = await productDAO.getAvailableProducts('category', 'Smartphone', null);

        expect(result).toEqual(mockRows);
        expect(mockAll).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE quantity > 0 AND category = ?`,
            ['Smartphone'],
            expect.any(Function)
        );
    })

    test("should fetch available products by model successfully", async () => {
        const mockRows = [
            { model: "Model1", category: "Smartphone", arrivalDate: "2023-01-01", sellingPrice: 599.99, quantity: 12, details: "details1" },
            { model: "Model2", category: "Laptop", arrivalDate: "2023-03-07", sellingPrice: 899.99, quantity: 8, details: "details2" }
        ];

        mockAll.mockImplementation((sql: string, params: any[], callback: (err: any, rows: any[]) => void) => {
            callback(null, mockRows);
        });

        const testProduct1 = {
            model: "Model1",
            category: "Smartphone",
            arrivalDate: "2023-01-01",
            sellingPrice: 599.99,
            quantity: 12,
            details: "details1"
        };
        
        const result = await productDAO.getAvailableProducts('category', 'Smartphone', null);

        expect(result).toEqual(mockRows);
        expect(mockAll).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE quantity > 0 AND category = ?`,
            ['Smartphone'],
            expect.any(Function)
        );
    })

    test("should throw ValidationError when grouping is null but category or model is not null", async () => {
        await expect(productDAO.getAvailableProducts(null, 'Smartphone', null)).rejects.toThrow(ValidationError);
        await expect(productDAO.getAvailableProducts(null, null, 'Model1')).rejects.toThrow(ValidationError);
    })

    test("should throw ValidationError when grouping is category but category is null or model is not null", async () => {
        await expect(productDAO.getAvailableProducts('category', null, null)).rejects.toThrow(ValidationError);
        await expect(productDAO.getAvailableProducts('category', 'Smartphone', 'Model1')).rejects.toThrow(ValidationError);
    })

    test("should throw ValidationError when category is invalid", async () => {
        await expect(productDAO.getAvailableProducts('category', 'InvalidCategory', null)).rejects.toThrow(ValidationError);
    })

    test("should throw ValidationError when grouping is model but model is null or category is not null", async () => {
        await expect(productDAO.getAvailableProducts('model', null, null)).rejects.toThrow(ValidationError);
        await expect(productDAO.getAvailableProducts('model', 'Smartphone', 'Model1')).rejects.toThrow(ValidationError);
    })

    test("should throw Error for invalid grouping parameter", async () => {
        await expect(productDAO.getAvailableProducts('invalidGrouping', null, null)).rejects.toThrow(Error);
    })

    ///////////////// TESTS FOR DELETES /////////////////////////
    test("should delete all products successfully", async () => {
        mockRun.mockImplementation((sql: string, callback: (err: any) => void) => {
            callback(null);
        });
    
        const result = await productDAO.deleteAllProducts();
    
        expect(result).toBe(true);
        expect(mockRun).toHaveBeenCalledWith(
            `DELETE FROM product_descriptors`,
            expect.any(Function)
        );
    });
    
    test("should delete a specific product successfully", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 12 });
        });
        mockRun.mockImplementation((sql: string, params: any[], callback: (err: any) => void) => {
            callback(null);
        });

        const result = await productDAO.deleteProduct("Model1");

        expect(result).toBe(true);
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)

        );
        expect(mockRun).toHaveBeenCalledWith(
            `DELETE FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
    })

    test("should throw ProductNotFoundError when deleting a non-existing product", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any) => void) => {
            callback(null);
        });

        await expect(productDAO.deleteProduct("Model1"))
            .rejects
            .toThrow(ProductNotFoundError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)

        );
        expect(mockRun).not.toHaveBeenCalled();
    })
});