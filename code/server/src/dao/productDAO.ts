import { Database } from 'sqlite3';
import db from '../db/db';
import { ProductNotFoundError, ProductAlreadyExistsError, EmptyProductStockError, LowProductStockError, ValidationError } from '../errors/productError';
import { DateError } from '../utilities';
import { Product } from '../components/product';

/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {

    private db: Database;

    constructor() {
        this.db = db;
    }
   
    async addProduct(model: string, category: string, arrivalDate: string | null,  sellingPrice: number, quantity: number, details: string | null): Promise<void> {
        const row = await new Promise<any>((resolve, reject) => {
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

        if (row) {
            throw new ProductAlreadyExistsError();
        }

        if (arrivalDate) {
            const currentDate = new Date();
            const arrivalDateObj = new Date(arrivalDate);
            if (arrivalDateObj > currentDate) {
                throw new DateError();
            }
        } else {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            arrivalDate = `${year}-${month}-${day}`;
        }


        if (quantity < 0) {
            throw new ValidationError("Quantity of the product must be greater than 0");
        }

        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    `INSERT INTO product_descriptors (model, category, arrivalDate, sellingPrice, quantity, details) VALUES (?, ?, ?, ?, ?, ?)`,
                    [model, category, arrivalDate, sellingPrice, quantity, details],
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
            console.error("Error adding product:", error);
            throw error; 
        }
    }

    async changeProductQuantity(model: string, newQuantity: number, changeDate: string | null): Promise<number> {
        const sql = `SELECT * FROM product_descriptors WHERE model = ?`;

        const row = await new Promise<any>((resolve, reject) => {
            this.db.get(sql, [model], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!row) {
            throw new ProductNotFoundError();
        }

        const oldQuantity = row.quantity

        if (changeDate) {
            const currentDate = new Date();
            const changeDateObj = new Date(changeDate);
            const arrivalDateObj = new Date(row.arrivalDate);
            if (changeDateObj > currentDate) {
                throw new DateError();
            } else if (changeDateObj < arrivalDateObj) {
                throw new DateError();
            }
        } else {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            changeDate = `${year}-${month}-${day}`;
        }

        if (newQuantity < 0) {
            throw new ValidationError("New quantity of the product must be greater than 0");
        }

        await new Promise<void>((resolve, reject) => {
            this.db.run(
                `UPDATE product_descriptors SET quantity = quantity + ?, arrivalDate = ? WHERE model = ?`,
                [newQuantity, changeDate, model],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });

        return oldQuantity + newQuantity
    }

    async sellProduct(model: string, quantity: number, sellingDate: string | null): Promise<number> {
        const row = await new Promise<any>((resolve, reject) => {
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

        if (!row) {
            throw new ProductNotFoundError();
        }

        const oldQuantity = row.quantity

        if (row.quantity === 0) {
            throw new EmptyProductStockError(); 
        } else if (row.quantity < quantity) {
            throw new LowProductStockError();
        } 

        if (quantity < 0) {
            throw new ValidationError("Quantity of the product must be greater than 0");
        }

        if (sellingDate) {
            const currentDate = new Date();
            const sellingDateObj = new Date(sellingDate);
            const arrivalDateObj = new Date(row.arrivalDate);
            if (sellingDateObj > currentDate) {
                throw new DateError();
            } else if (sellingDateObj < arrivalDateObj) {
                throw new DateError();
            }
        } else {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            sellingDate = `${year}-${month}-${day}`;
        }

        await new Promise<void>((resolve, reject) => {
            this.db.run(
                `UPDATE product_descriptors SET quantity = quantity - ?, arrivalDate = ? WHERE model = ?`,
                [quantity, sellingDate, model],
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });

        return oldQuantity - quantity;
    }

    async getProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        let query = 'SELECT * FROM product_descriptors';
        let params: (string)[] = [];
        const allowedCategories = ["Smartphone", "Laptop", "Appliance"];

        if (grouping === null) {
            if (category !== null || model !== null) {
                throw new ValidationError("Grouping is null but category or model is not null.");
            }
        } else if (grouping === 'category') {
            if (category === null || model !== null) {
                throw new ValidationError('Grouping is category but category is null or model is not null.');
            }
            if (!allowedCategories.includes(category)) {
                throw new ValidationError(`Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`);
            }
            query += ' WHERE category = ?';
            params.push(category);
        } else if (grouping === 'model') {
            if (model === null || category !== null) {
                throw new ValidationError('Grouping is model but model is null or category is not null.');
            }
            query += ' WHERE model = ?';
            params.push(model);
        } else {
            throw new Error('Invalid grouping parameter');
        }

        try {
            const rows = await new Promise<any[]>((resolve, reject) => {
                this.db.all(query, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            if (grouping === 'model' && rows.length === 0) {
                throw new ProductNotFoundError();
            }
    
            return rows.map(row => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity))
        } catch (error) {
            console.error("Error getting the products: ", error);
            throw error;
        }
    }

    async getAvailableProducts(grouping: string | null, category: string | null, model: string | null): Promise<Product[]> {
        let query = 'SELECT * FROM product_descriptors WHERE quantity > 0';
        let params: (string)[] = [];
        const allowedCategories = ["Smartphone", "Laptop", "Appliance"];
    
        if (grouping === null) {
            if (category !== null || model !== null) {
                throw new ValidationError("Grouping is null but category or model is not null.");
            }
        } else if (grouping === 'category') {
            if (category === null || model !== null) {
                throw new ValidationError('Grouping is category but category is null or model is not null.');
            }
            if (!allowedCategories.includes(category)) {
                throw new ValidationError(`Invalid category. Allowed categories are: ${allowedCategories.join(", ")}`);
            }
            query += ' AND category = ?';
            params.push(category);
        } else if (grouping === 'model') {
            if (model === null || category !== null) {
                throw new ValidationError('Grouping is model but model is null or category is not null.');
            }

            const modelExists = await new Promise<boolean>((resolve, reject) => {
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
    
            if (!modelExists) {
                throw new ProductNotFoundError();
            }
    
            query += ' AND model = ?';
            params.push(model);
        } else {
            throw new ValidationError('Invalid grouping parameter');
        }
    
        try {
            const rows = await new Promise<any[]>((resolve, reject) => {
                this.db.all(query, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
    
            if (grouping === 'model' && rows.length === 0) {
                // in this case the model exists but it is not available
                return [];
            }
    
            return rows.map(row => new Product(row.sellingPrice, row.model, row.category, row.arrivalDate, row.details, row.quantity));
        } catch (error) {
            console.error("Error getting the available products: ", error);
            throw error;
        }
    }

    async deleteAllProducts(): Promise<boolean> {
        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    `DELETE FROM product_descriptors`,
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
            console.error("Error deleting products:", error);
            throw error; 
        }
    }

    async deleteProduct(model: string): Promise<boolean> {
        const row = await new Promise<any>((resolve, reject) => {
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

        if (!row) {
            throw new ProductNotFoundError();
        }

        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    `DELETE FROM product_descriptors WHERE model = ?`,
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
            console.error("Error deleting product:", error);
            throw error; 
        }
    }
}

export default ProductDAO;

