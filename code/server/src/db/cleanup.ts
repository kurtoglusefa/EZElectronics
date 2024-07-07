"use strict"

import db from "../db/db";

/**
 * Deletes all data from the database.
 * This function must be called before any integration test, to ensure a clean database state for each test run.
 */

export async function cleanup(): Promise<void> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("DELETE FROM cart_items", (err) => {
                if (err) return reject(err);
                db.run("DELETE FROM carts", (err) => {
                    if (err) return reject(err);
                    db.run("DELETE FROM reviews", (err) => {
                        if (err) return reject(err);
                        db.run("DELETE FROM product_descriptors", (err) => {
                            if (err) return reject(err);
                            db.run("DELETE FROM users", (err) => {
                                if (err) return reject(err);
                                resolve();
                            });
                        });
                    });
                });
            });
        });
    });
}

