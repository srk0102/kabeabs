import React, { useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { HiOutlinePlus, HiMinusSm } from "react-icons/hi";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Backendless from 'backendless'

import images from "../constants/images";

import { menu } from '../constants'

export function Menu() {

	const [cart, setCart] = useState([])
	const [modal, setModel] = useState(false)
	const [UserEmail, setEmail] = useState('')
	const [UserPhone, setPhone] = useState('')

	const addToCart = (product) => {
		const existingItem = cart.find(item => item.id === product.id);
		if (existingItem) {
			existingItem.quantity++;
			setCart([...cart]);
		} else {
			let orderItem = { ...product, quantity: 1 }
			setCart([...cart, { ...orderItem }]);
		}
		console.log(cart)
		toast(`${product.title} added to cart`, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark"
		});
	};

	const calculateItemPrice = (item) => {
		// Extract the numeric price value (assuming format is "$XX.XX")
		const priceValue = parseFloat(item.price.slice(1));
		return priceValue * item.quantity;
	};

	const calculateTotal = () => {
		return cart.reduce((acc, cartItem) => acc + (cartItem.price.slice(1) * cartItem.quantity), 0);
	};


	const removeFromCart = (itemToRemove) => {
		const updatedCart = cart.map((item) => {
			if (item.id === itemToRemove.id) {
				if (item.quantity > 1) {
					return { ...item, quantity: item.quantity - 1 };
				}
				return null; // Remove the item from the updated cart array
			}
			return item;
		}).filter(Boolean); // Remove null values from the array

		setCart(updatedCart);

		if (itemToRemove.quantity === 1) {
			toast(`${itemToRemove.title} removed from cart`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark"
			});
		}
	};

	const checkOut = async () => {
		// Check if there are items in the cart
		if (cart.length === 0) {
			toast.error('Your cart is empty! Please add items before checkout.', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark"
			});
			return;
		}

		// Generate a random order ID
		const orderId = Math.random().toString(36).substring(2, 15);

		// Prepare cart items data in the expected format
		const items = cart.map(item => ({
			title: item.title,
			price: item.price, // Assuming price is a number
			quantity: item.quantity
		}));

		// Calculate total price (assuming price is a number in the cart item)
		const total = calculateTotal();

		// Fetch user email and phone number
		const email = UserEmail;
		const phone = UserPhone;

		// Create the order object
		const orderObject = {
			email,
			items,
			orderid: orderId,
			phone,
			total
		};

		try {
			Backendless.initApp( "8EFCA6F3-230D-6683-FFA9-ABAA6CB0E900", "F552546A-B35F-4F4B-8DC5-5089CBC9D476" );

			// Save the order to Backendless
			const savedOrder = await Backendless.Data.of('orders').save(orderObject);

			if (!savedOrder.objectId) {
				throw new Error('Order saving failed on server.');
			}

			// Handle successful checkout (clear cart, show confirmation toast, etc.)
			setCart([]);
			toast.success('Order checkout successful!', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark"
			});
		} catch (error) {
			console.error('Checkout failed:', error);
			toast.error('An error occurred during checkout. Please try again.', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark"
			});
		}
	};



	return (
		<>
			<ToastContainer />
			<nav className="bg-white border-gray-200 dark:bg-gray-900">
				<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
					<a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
						<img src={images.logo} className="h-8" alt="Indian Kababs and Wraps" />
					</a>
					<ul className="font-medium flex p-4 p-0 mt-4 flex-row items-center space-x-8 rtl:space-x-reverse mt-0 border-0 bg-white dark:bg-gray-800 dark:bg-gray-900 dark:border-gray-700">
						<li>
							<a href="#" className="block py-2 px-3 text-white bg-blue-700 rounded bg-transparent p-0" aria-current="page">Home</a>
						</li>
						<li>
							<button data-modal-target="default-modal" onClick={() => setModel(!modal)} className="block py-3 px-5 text-white bg-blue-700 rounded bg-transparent p-0">
								<FaShoppingCart />
							</button>
						</li>
					</ul>
				</div>
			</nav>
			{modal && <div id="default-modal" tabindex="-1" aria-hidden="true" className="fixed left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
				<div className="relative p-4 w-full max-w-2xl max-h-full">
					<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
						<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-white">
								Cart
							</h3>
							<button onClick={() => setModel(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
								<svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
								</svg>
								<span className="sr-only">Close modal</span>
							</button>
						</div>
						<div className="p-4 md:p-5 space-y-4">
							<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
								<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
									<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
										<tr>
											<th scope="col" class="px-6 py-3">
												Product name
											</th>
											<th scope="col" class="px-6 py-3">
												Price
											</th>
											<th scope="col" class="px-6 py-3">
												Quantity
											</th>
											<th scope="col" class="px-6 py-3">
												totalPrice
											</th>
										</tr>
									</thead>
									<tbody>
										{
											cart.map((item) => {
												return (
													<>
														<tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
															<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
																{item.title}
															</th>
															<td class="px-6 py-4">
																{item.price}
															</td>
															<td class="px-6 py-4">
																<div className='flex text-xl gap-x-8'><HiOutlinePlus onClick={() => addToCart(item)} className='border pointer' />{item.quantity}<HiMinusSm onClick={() => removeFromCart(item)} className='border pointer' /></div>
															</td>
															<td class="px-6 py-4">
																{calculateItemPrice(item)}
															</td>
														</tr>
													</>
												)
											})
										}
										<tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
											<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

											</th>
											<td class="px-6 py-4">

											</td>
											<td class="px-6 py-4">

											</td>
											<td class="px-6 py-4">
												cart value: {calculateTotal()}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className='max-w-sm mx-auto'>
							<div class="mb-5">
								<label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
								<input type="email" onChange={(event) => setEmail(event.target.value)} id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@indiankebabs.com" required />
							</div>
							<div class="mb-5">
								<label for="phone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Phone</label>
								<input type="text" onChange={(event) => setPhone(event.target.value)} id="phone" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="+1 8xxxxxxxx" required />
							</div>
						</div>
						<div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
							<button data-modal-hide="default-modal" onClick={checkOut} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">checkout</button>
						</div>
					</div>
				</div>
			</div>}
			<div className='grid grid-rows-4'>
				{
					menu.map((item) => {
						return (
							<>
								<div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
									<div className="px-5 pb-5">
										<a href="#">
											<h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{item.title}</h5>
											<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{item.description}</p>
										</a>
										<div className="flex items-center justify-between">
											<span className="text-3xl font-bold text-gray-900 dark:text-white">{item.price}</span>
											<button onClick={() => addToCart(item)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add to cart</button>
										</div>
									</div>
								</div>
							</>
						)
					})
				}
			</div>
		</>
	);
}