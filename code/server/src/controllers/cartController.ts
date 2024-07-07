import { User } from "../components/user";
import { Cart } from "../components/cart";
import CartDAO from "../dao/cartDAO";


/**
 * Represents a controller for managing shopping carts.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */
class CartController {
    private dao: CartDAO;

    constructor() {
        this.dao = new CartDAO();
    }

    /**
     * Adds a product to the user's cart. If the product is already in the cart, the quantity should be increased by 1.
     * If the product is not in the cart, it should be added with a quantity of 1.
     * If there is no current unpaid cart in the database, then a new cart should be created.
     * @param user - The user to whom the product should be added.
     * @param productId - The model of the product to add.
     * @returns A Promise that resolves to `true` if the product was successfully added.
     */
    async addToCart(user: User, product: string): Promise<boolean> {
        try {
            await this.dao.addProductToCart(user.username, product);
            return true;
        } catch (error) {
            console.error("Error adding product to cart:", error);
            throw error;
        }
    }

    /**
     * Retrieves the current cart for a specific user.
     * @param user - The user for whom to retrieve the cart.
     * @returns A Promise that resolves to the user's cart or an empty one if there is no current cart.
     */
    async getCart(user: User): Promise<Cart> {
        try {
            return await this.dao.getCurrentCart(user.username);
        } catch (error) {
            console.error("Error getting cart:", error);
            throw error;
        }
    }

    /**
     * Checks out the user's cart. We assume that payment is always successful, there is no need to implement anything related to payment.
     * @param user - The user whose cart should be checked out.
     * @returns A Promise that resolves to `true` if the cart was successfully checked out.
     */
    async checkoutCart(user: User): Promise<boolean> {
        try {
            await this.dao.checkoutCart(user.username);
            return true;
        } catch (error) {
            console.error("Error checking out cart:", error);
            throw error;
        }
    }

    /**
     * Retrieves all paid carts for a specific customer.
     * @param user - The customer for whom to retrieve the carts.
     * @returns A Promise that resolves to an array of carts belonging to the customer.
     * Only the carts that have been checked out should be returned, the current cart should not be included in the result.
     */
    async getCustomerCarts(user: User): Promise<Cart[]> {
        try {
            return await this.dao.getPaidCarts(user.username);
        } catch (error) {
            console.error("Error getting customer carts:", error);
            throw error;
        }
    }

    /**
     * Removes one product unit from the current cart. In case there is more than one unit in the cart, only one should be removed.
     * @param user The user who owns the cart.
     * @param product The model of the product to remove.
     * @returns A Promise that resolves to `true` if the product was successfully removed.
     */
    async removeProductFromCart(user: User, product: string): Promise<boolean> {
        try {
            await this.dao.removeProductFromCart(user.username, product);
            return true;
        } catch (error) {
            console.error("Error removing product from cart:", error);
            throw error;
        }
    }

    /**
     * Removes all products from the current cart.
     * @param user - The user who owns the cart.
     * @returns A Promise that resolves to `true` if the cart was successfully cleared.
     */
    async clearCart(user: User): Promise<boolean> {
        try {
            await this.dao.emptyCart(user.username);
            return true;
        } catch (error) {
            console.error("Error clearing cart:", error);
            throw error;
        }
    }

    /**
     * Deletes all carts of all users.
     * @returns A Promise that resolves to `true` if all carts were successfully deleted.
     */
    async deleteAllCarts(): Promise<boolean> {
        try {
            await this.dao.deleteAllCarts();
            return true;
        } catch (error) {
            console.error("Error deleting all carts:", error);
            throw error;
        }
    }

    /**
     * Retrieves all carts in the database.
     * @returns A Promise that resolves to an array of carts.
     */
    async getAllCarts(): Promise<Cart[]> {
        try {
            return await this.dao.getAllCarts();
        } catch (error) {
            console.error("Error getting all carts:", error);
            throw error;
        }
    }
}

export default CartController;

