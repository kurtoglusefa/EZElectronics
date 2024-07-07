import { Database as SQLite3Database} from 'sqlite3';
import ReviewDAO from "../../src/dao/reviewDAO";
import { ExistingReviewError, NoReviewProductError } from "../../src/errors/reviewError";
import { ProductNotFoundError, ValidationError } from "../../src/errors/productError";
import { ProductReview } from '../../src/components/review';

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

describe('ReviewDAO', () => {
    let reviewDAO: ReviewDAO;
    let mockRun: jest.Mock;
    let mockGet: jest.Mock;
    let mockAll: jest.Mock;

    beforeEach(() => {
        jest.resetAllMocks(); // Reset all mocks before each test
        reviewDAO = new ReviewDAO();
        mockRun = jest.fn();
        mockGet = jest.fn();
        mockAll = jest.fn();
        (SQLite3Database.prototype as any).run = mockRun;
        (SQLite3Database.prototype as any).get = mockGet;
        (SQLite3Database.prototype as any).all = mockAll;
    });


    test("should add a review successfully", async () => {

        mockGet.mockImplementationOnce((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 5 }); // get a product descriptor
        });
    
        mockGet.mockImplementationOnce((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, null); // No existing review
        });
    
        mockRun.mockImplementation((sql: string, params: any[], callback: (err: any) => void) => {
            callback(null);
        });
    
        await reviewDAO.addReview("Model1", "user1", 5, "2023-01-01", "Great product!");
    
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM reviews WHERE product_model = ? AND username = ?`,
            ["Model1", "user1"],
            expect.any(Function)
        );
        expect(mockRun).toHaveBeenCalledWith(
            `INSERT INTO reviews (username, product_model, score, date, comment) VALUES (?, ?, ?, ?, ?)`,
            ["user1", "Model1", 5, expect.any(String), "Great product!"],
            expect.any(Function)
        );
    });
    

    test("should throw ProductNotFoundError when adding a review for a non-existing product", async () => {
        mockGet.mockImplementation((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, null);
        });

        await expect(reviewDAO.addReview("Model72", "user1", 5, "2023-01-01", "Great product!"))
            .rejects
            .toThrow(ProductNotFoundError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model72"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });

    test("should throw ExistingReviewError when adding a review that already exists", async () => {

        mockGet.mockImplementationOnce((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 5 }); // get a product descriptor
        });
    
        mockGet.mockImplementationOnce((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", user: "user1", score: 5, date:"", comment: "amazing" }); // get a review
        });

        await expect(reviewDAO.addReview("Model1", "user1", 5, "2023-01-01", "Great product!"))
            .rejects
            .toThrow(ExistingReviewError);

        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM reviews WHERE product_model = ? AND username = ?`,
            ["Model1", "user1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });

    test("should throw ValidationError when score is out of range", async () => {
   
        mockGet.mockImplementationOnce((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, { model: "Model1", arrivalDate: "2023-01-01", quantity: 5 }); // get a product descriptor
        });
    
        mockGet.mockImplementationOnce((sql: string, params: any[], callback: (err: any, row: any) => void) => {
            callback(null, null); // No existing review
        });
    
        mockRun.mockImplementation((sql: string, params: any[], callback: (err: any) => void) => {
            callback(null);
        });
    
        await expect(reviewDAO.addReview("Model1", "user1", 0, "2023-01-01", "Great product!"))
        .rejects
        .toThrow(ValidationError);
    
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM product_descriptors WHERE model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockGet).toHaveBeenCalledWith(
            `SELECT * FROM reviews WHERE product_model = ? AND username = ?`,
            ["Model1", "user1"],
            expect.any(Function)
        );
      
        expect(mockRun).not.toHaveBeenCalled();
    });
    

    test("should get all reviews successfully", async () => {
        const mockReviews = [
            { product_model: "Model1", username: "user1", score: 5, date: "2023-01-01", comment: "Great product!" },
            { product_model: "Model1", username: "user2", score: 4, date: "2023-01-02", comment: "Good product!" }
        ];
    
        mockAll.mockImplementation((sql: string, params: any[], callback: (err: any, rows: any[]) => void) => {
            callback(null, mockReviews);
        });
    
        const expectedReviews = mockReviews.map(row => new ProductReview(row.product_model, row.username, row.score, row.date, row.comment));
    
        const result = await reviewDAO.getReviewsByProduct("Model1");
    
        expect(result).toEqual(expectedReviews);
        expect(mockAll).toHaveBeenCalledWith(
            `SELECT * FROM reviews WHERE product_model = ?`,
            ["Model1"],
            expect.any(Function)
        );
    });
    
    test("should delete all reviews of a product successfully", async () => {
        
        const mockReviews = [
            { model: "Model1", user: "user1", score: 5, date: "2023-01-01", comment: "Great product!" }
        ];
    
        mockAll.mockImplementation((sql: string, params: any[], callback: (err: any, rows: any[]) => void) => {
            callback(null, mockReviews);
        });
        mockRun.mockImplementation((sql: string, params: any[], callback: (err: any) => void) => {
            callback(null);
        });
    
        const result = await reviewDAO.deleteAllReviewsOfProduct("Model1");
    
        expect(result).toBe(true);
        expect(mockAll).toHaveBeenCalledWith(
            `SELECT * FROM reviews WHERE product_model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).toHaveBeenCalledWith(
            `DELETE FROM reviews WHERE product_model = ?`,
            ["Model1"],
            expect.any(Function)
        );
    });
    

    test("should throw ProductNotFoundError when deleting reviews for a non-existing product model", async () => {

        mockAll.mockImplementation((sql: string, params: any[], callback: (err: any, rows: any[]) => void) => {
            callback(null, []);
        });
    
        await expect(reviewDAO.deleteAllReviewsOfProduct("Model1"))
            .rejects
            .toThrow(ProductNotFoundError);
    
        expect(mockAll).toHaveBeenCalledWith(
            `SELECT * FROM reviews WHERE product_model = ?`,
            ["Model1"],
            expect.any(Function)
        );
        expect(mockRun).not.toHaveBeenCalled();
    });
    
    test("should delete all reviews successfully", async () => {
        mockRun.mockImplementation((sql: string, callback: (err: any) => void) => {
            callback(null);
        });
    
        const result = await reviewDAO.deleteAllReviews();
    
        expect(result).toBe(true);
        expect(mockRun).toHaveBeenCalledWith(
            `DELETE FROM reviews`,
            expect.any(Function)
        );
    });
});
