import { Database } from 'sqlite3';
import db from '../db/db';
import { Cart, ProductInCart } from '../components/cart';
import { ProductNotInCartError, CartNotFoundError, EmptyCartError } from '../errors/cartError';
import { ProductNotFoundError } from '../errors/productError';

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class CartDAO {
    private db: Database;

    constructor() {
        this.db = db;
    }

    async getAllCarts(): Promise<Cart[]> {
        try {
            const products = await new Promise<any[]>((resolve, reject) => {
                this.db.all(`SELECT * FROM cart_items`, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            const carts = await new Promise<any[]>((resolve, reject) => {
                this.db.all(`SELECT * FROM carts`, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            return carts.map(cart => ({
                customer: cart.customer,
                username: cart.username,
                paid: cart.paid,
                paymentDate: cart.paymentDate,
                total: cart.total,
                products: products.filter(product => product.cart_id === cart.id)
            }));
        } catch (error) {
            console.error("Error getting all carts:", error);
            throw error;
        }
    }

    async deleteAllCarts(): Promise<void> {
        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(`DELETE FROM cart_items`, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error("Error deleting all carts:", error);
            throw error;
        }

        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(`DELETE FROM carts`, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error("Error deleting all carts:", error);
            throw error;
        }
    }
    

    async getPaidCarts(username: string): Promise<Cart[]> {
        try {
            const carts = await new Promise<any[]>((resolve, reject) => {
                this.db.all(`SELECT * FROM carts WHERE username = ? AND paid = 1`, [username], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            const cartIds = carts.map(cart => cart.id);

            const products = await new Promise<any[]>((resolve, reject) => {
                this.db.all(
                    `SELECT ci.cart_id, ci.model, ci.category, ci.quantity, ci.price FROM cart_items ci WHERE ci.cart_id IN (${cartIds.join(',')})`,
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    }
                );
            });

            const cartsWithProducts = carts.map(cart => ({
                customer: cart.username,
                paid: cart.paid === 1,
                paymentDate: cart.paymentDate,
                total: cart.total,
                products: products.filter(product => product.cart_id === cart.id)
            }));

            return cartsWithProducts;
        } catch (error) {
            console.error("Error getting paid carts:", error);
            throw error;
        }
    }

    async checkoutCart(username: string): Promise<void> {

        // Check if there is a cart
        const cart = await new Promise<any>((resolve, reject) => {
            this.db.get(`SELECT * FROM carts WHERE username = ? AND paid = 0`, [username], (err, row) => {
                if (err || !row) {
                    reject(new CartNotFoundError());
                } else {
                    resolve(row);
                }
            });
        });
    
        // Check if there are products
        await new Promise<any[]>((resolve, reject) => {
            this.db.all(`SELECT * FROM cart_items WHERE cart_id = ?`, [cart.id], (err, rows) => {
                if (err) {
                    reject(new EmptyCartError());
                } else {
                    resolve(rows);
                }
            });
        });
    
        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    
        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(`UPDATE carts SET paid = 1, paymentDate = ? WHERE username = ? AND paid = 0`, [formattedDate, username], err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error("Error checking out cart:", error);
            throw error;
        }
    }
    

    async getCurrentCart(username: string): Promise<Cart> {
        try {
            const cart = await new Promise<any>((resolve, reject) => {
                this.db.get(
                    `SELECT * FROM carts WHERE username = ? AND paid = 0`,
                    [username],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });

            if (!cart) {
                await new Promise<void>((resolve, reject) => {
                    this.db.run(
                        `INSERT INTO carts (username, paid, paymentDate, total) VALUES (?, 0, "", 0)`,
                        [username],
                        err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });

                return {
                    customer: username,
                    paid: false,
                    paymentDate: "",
                    total: 0,
                    products: []
                };
            } else {
                const products = await this.getProductsInCart(cart.id);
                return {
                    customer: cart.username,
                    paid: cart.paid,
                    paymentDate: cart.paymentDate,
                    total: cart.total,
                    products: products
                };
            }
        } catch (error) {
            console.error("Error getting current cart:", error);
            throw error;
        }
    }

    async addProductToCart(username: string, model: string): Promise<void> {
        try {
            const cart = await new Promise<any>((resolve, reject) => {
                this.db.get(
                    `SELECT * FROM carts WHERE username = ? AND paid = 0`,
                    [username],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });

            if (!cart) {
                await new Promise<void>((resolve, reject) => {
                    this.db.run(
                        `INSERT INTO carts (username, paid, paymentDate, total) VALUES (?, 0, "", 0)`,
                        [username],
                        err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            }

            const product = await new Promise<any>((resolve, reject) => {
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

            if (!product) {
                throw new ProductNotFoundError();
            }

            const existingProduct = await new Promise<any>((resolve, reject) => {
                this.db.get(
                    `SELECT * FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE username = ? AND paid = 0) AND model = ?`,
                    [username, model],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });

            if (existingProduct) {
                await new Promise<void>((resolve, reject) => {
                    this.db.run(
                        `UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = ? AND model = ?`,
                        [existingProduct.cart_id, model],
                        err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            } else {
                await new Promise<void>((resolve, reject) => {
                    this.db.run(
                        `INSERT INTO cart_items (cart_id, model, quantity, price, category) VALUES ((SELECT id FROM carts WHERE username = ? AND paid = 0), ?, 1, ?, ?)`,
                        [username, model, product.sellingPrice, product.category],
                        err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            }

            await this.updateCartTotal(username);
        } catch (error) {
            console.error("Error adding product to cart:", error);
            throw error;
        }
    }

    async updateCartTotal(username: string): Promise<void> {
        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    `UPDATE carts SET total = (SELECT SUM(price * quantity) FROM cart_items WHERE cart_items.cart_id = carts.id) WHERE username = ? AND paid = 0`,
                    [username],
                    err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });
        } catch (error) {
            console.error("Error updating cart total:", error);
            throw error;
        }
    }

    async getProductsInCart(cartId: number): Promise<ProductInCart[]> {
        try {
            const products = await new Promise<any[]>((resolve, reject) => {
                this.db.all(
                    `SELECT * FROM cart_items WHERE cart_id = ?`,
                    [cartId],
                    (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    }
                );
            });

            return products.map(product => ({
                category: product.category,
                model: product.model,
                quantity: product.quantity,
                price: product.price
            }));
        } catch (error) {
            console.error("Error getting products in cart:", error);
            throw error;
        }
    }

    async removeProductFromCart(username: string, model: string): Promise<void> {
        try {
            const product = await new Promise<any>((resolve, reject) => {
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

            if (!product) {
                throw new ProductNotFoundError();
            }

            const productInCart = await new Promise<any>((resolve, reject) => {
                this.db.get(
                    `SELECT * FROM cart_items WHERE model = ? AND cart_id = (SELECT id FROM carts WHERE username = ? AND paid = 0)`,
                    [model, username],
                    (err, row) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row);
                        }
                    }
                );
            });

            if (!productInCart) {
                throw new ProductNotInCartError();
            }

            if (productInCart.quantity > 1) {
                await new Promise<void>((resolve, reject) => {
                    this.db.run(
                        `UPDATE cart_items SET quantity = quantity - 1 WHERE cart_id = ? AND model = ?`,
                        [productInCart.cart_id, model],
                        err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            } else {
                await new Promise<void>((resolve, reject) => {
                    this.db.run(
                        `DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE username = ? AND paid = 0) AND model = ?`,
                        [username, model],
                        err => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        }
                    );
                });
            }

            await this.updateCartTotal(username);
        } catch (error) {
            console.error("Error removing product from cart:", error);
            throw error;
        }
    }

    async emptyCart(username: string): Promise<void> {
        try {
            await new Promise<void>((resolve, reject) => {
                this.db.run(
                    `DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE username = ? AND paid = 0)`,
                    [username],
                    err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });

            await this.updateCartTotal(username);
        } catch (error) {
            console.error("Error emptying cart:", error);
            throw error;
        }
    }
}

export default CartDAO;

