import { Database } from 'sqlite3';
import db from '../db/db';
import { ProductReview } from '../components/review';
import { ExistingReviewError, NoReviewProductError } from '../errors/reviewError';
import { ProductNotFoundError, ValidationError } from '../errors/productError';

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ReviewDAO {
    private db: Database;

    constructor() {
        this.db = db;
    }

    async addReview(model: string, user: string, score: number, date: string, comment: string): Promise<void> {
        const productRow = await new Promise<any>((resolve, reject) => {
            this.db.get(
                `SELECT * FROM product_descriptors WHERE model = ?`,
                [model],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });

        if (!productRow) {
            throw new ProductNotFoundError();
        }

        const currentDate: Date = new Date();
        const formattedDate:string= currentDate.toISOString().split('T')[0]

        const reviewRow = await new Promise<any>((resolve, reject) => {
            this.db.get(
                `SELECT * FROM reviews WHERE product_model = ? AND username = ?`,
                [model, user],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });

        if (reviewRow) {
            throw new ExistingReviewError();
        }

        if (score < 1 || score > 5) {
            throw new ValidationError('Score must be between 1 and 5');
        }

        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    `INSERT INTO reviews (username, product_model, score, date, comment) VALUES (?, ?, ?, ?, ?)`,
                    [user, model, score, formattedDate, comment],
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    }
    async productExists(model: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.db.get(
                `SELECT 1 FROM product_descriptors WHERE model = ?`,
                [model],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(!!row);
                    }
                }
            );
        });
    }

 
    async getReviewsByProduct(model: string): Promise<ProductReview[]> {
        const rows = await new Promise<any[]>((resolve, reject) => {
            this.db.all(
                `SELECT * FROM reviews WHERE product_model = ?`,
                [model],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });

        return rows.map(row => new ProductReview(row.product_model, row.username, row.score, row.date, row.comment));
    }

    async deleteReview(model: string, user: string): Promise<boolean> {
        const row = await new Promise<any>((resolve, reject) => {
            this.db.get(
                `SELECT * FROM reviews WHERE product_model = ? AND username = ?`,
                [model, user],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });

        if (!row) {
            throw new NoReviewProductError();
        }

        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    `DELETE FROM reviews WHERE product_model = ? AND username = ?`,
                    [model, user],
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });
            return true;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }

    async deleteAllReviewsOfProduct(model: string): Promise<boolean> {
        const rows = await new Promise<any[]>((resolve, reject) => {
            this.db.all(
                `SELECT * FROM reviews WHERE product_model = ?`,
                [model],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });

        if (rows.length === 0) {
            throw new ProductNotFoundError();
        }

        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    `DELETE FROM reviews WHERE product_model = ?`,
                    [model],
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });
            return true;
        } catch (error) {
            console.error('Error deleting all reviews of the product:', error);
            throw error;
        }
    }

    async deleteAllReviews(): Promise<boolean> {
        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    `DELETE FROM reviews`,
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });
            return true;
        } catch (error) {
            console.error('Error deleting all reviews:', error);
            throw error;
        }
    }
}

export default ReviewDAO;
