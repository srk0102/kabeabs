import React, { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { HiOutlinePlus, HiMinusSm } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Backendless from "backendless";
import { Button } from "flowbite-react";

import images from "../constants/images";

import { menu } from "../constants";

export function Menu() {
	const [cart, setCart] = useState([]);
	const [modal, setModel] = useState(false);
	const [UserEmail, setEmail] = useState("");
	const [UserPhone, setPhone] = useState("");
	const [UserName, setName] = useState("");

	const addToCart = (product) => {
		const existingItem = cart.find((item) => item.id === product.id);
		if (existingItem) {
			existingItem.quantity++;
			setCart([...cart]);
		} else {
			let orderItem = { ...product, quantity: 1 };
			setCart([...cart, { ...orderItem }]);
		}
		console.log(cart);
		toast(`${product.title} added to cart`, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	};

	const calculateItemPrice = (item) => {
		// Extract the numeric price value (assuming format is "$XX.XX")
		const priceValue = parseFloat(item.price.slice(1));
		return priceValue * item.quantity;
	};

	const calculateTotal = () => {
		return cart.reduce(
			(acc, cartItem) => acc + cartItem.price.slice(1) * cartItem.quantity,
			0
		);
	};

	const removeFromCart = (itemToRemove) => {
		const updatedCart = cart
			.map((item) => {
				if (item.id === itemToRemove.id) {
					if (item.quantity > 1) {
						return { ...item, quantity: item.quantity - 1 };
					}
					return null; // Remove the item from the updated cart array
				}
				return item;
			})
			.filter(Boolean); // Remove null values from the array

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
				theme: "dark",
			});
		}
	};

	const checkOut = async () => {
		// Check if there are items in the cart
		if (cart.length === 0) {
			toast.error("Your cart is empty! Please add items before checkout.", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
			return;
		}

		// Generate a random order ID
		const orderId = Math.random().toString(36).substring(2, 15);

		// Prepare cart items data in the expected format
		const items = cart.map((item) => ({
			title: item.title,
			price: item.price, // Assuming price is a number
			quantity: item.quantity,
		}));

		// Calculate total price (assuming price is a number in the cart item)
		const total = calculateTotal();

		// Fetch user email and phone number
		const email = UserEmail;
		const phone = UserPhone;
		const name = UserName;

		// Create the order object
		const orderObject = {
			email,
			items,
			orderid: orderId,
			phone,
			total,
			name,
			completed: false
		};

		try {
			Backendless.initApp(
				"8EFCA6F3-230D-6683-FFA9-ABAA6CB0E900",
				"F552546A-B35F-4F4B-8DC5-5089CBC9D476"
			);

			// Save the order to Backendless
			const savedOrder = await Backendless.Data.of("orders").save(orderObject);

			if (!savedOrder.objectId) {
				throw new Error("Order saving failed on server.");
			}

			// Handle successful checkout (clear cart, show confirmation toast, etc.)
			setCart([]);
			toast.success("Order checkout successful!", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		} catch (error) {
			console.error("Checkout failed:", error);
			toast.error("An error occurred during checkout. Please try again.", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "dark",
			});
		}
	};

	const groupByCategory = (menuItems) => {
		const groupedMenu = {};
		const categories = [];
		menuItems.forEach((item) => {
			if (!groupedMenu[item.category]) {
				groupedMenu[item.category] = [];
				categories.push(item.category);
			}
			groupedMenu[item.category].push(item);
		});
		return { groupedMenu, categories };
	};

	const { groupedMenu, categories } = groupByCategory(menu);
	const [cat, setCat] = useState(categories[0])

	return (
		<>
			<ToastContainer />
			<nav className="bg-gradient-to-b from-primary-golden to-black">
				<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
					<a
						href="/"
						className="flex items-center space-x-3 rtl:space-x-reverse"
					>
						<img
							src={images.logo}
							className="h-14"
							alt="Indian Kababs and Wraps"
						/>
					</a>
					<ul className="font-medium flex p-4 p-0 mt-4 flex-row items-center space-x-8 rtl:space-x-reverse mt-0 border-0 ">
						<li>
							<a
								href="/"
								className="block py-2 px-3 text-white bg-blue-700 rounded bg-transparent p-0  hover:text-primary-black"
								aria-current="page"
							>
								Home
							</a>
						</li>
						<li>
							<button
								data-modal-target="default-modal"
								onClick={() => setModel(!modal)}
								className="block py-3 px-5 text-white bg-blue-700 rounded bg-transparent p-0  hover:text-primary-black"
							>
								<FaShoppingCart />
							</button>
						</li>
					</ul>
				</div>
			</nav>
			{modal && (
				<div
					id="default-modal"
					tabindex="-1"
					aria-hidden="true"
					className="fixed w-full p-4 overflow-x-hidden z-10 overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
				>
					<div className="relative p-4 w-full max-w-2xl max-h-full">
						<div className="relative  rounded-lg shadow bg-primary-golden">
							<div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
								<h3 className="text-xl font-semibold text-gray-900 dark:text-black">
									Cart
								</h3>
								<button
									onClick={() => setModel(false)}
									type="button"
									className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
									data-modal-hide="default-modal"
								>
									<svg
										className="w-3 h-3"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 14 14"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
										/>
									</svg>
									<span className="sr-only">Close modal</span>
								</button>
							</div>
							<div className="p-4 md:p-5 space-y-4">
								<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
									<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
										<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-primary-golden dark:text-black ">
											<tr>
												<th scope="col" className="px-6 py-3">
													Product name
												</th>
												<th scope="col" className="px-6 py-3">
													Price
												</th>
												<th scope="col" className="px-6 py-3">
													Quantity
												</th>
												<th scope="col" className="px-6 py-3">
													totalPrice
												</th>
											</tr>
										</thead>
										<tbody>
											{cart.map((item) => {
												return (
													<>
														<tr className="dark:bg-primary-golden border-b dark:border-gray-700">
															<th
																scope="row"
																className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black"
															>
																{item.title}
															</th>
															<td className="px-6 py-4 text-black">{item.price}</td>
															<td className="px-6 py-4">
																<div className="flex text-xl gap-x-8 text-black">
																	<HiOutlinePlus
																		onClick={() => addToCart(item)}
																		className="border pointer"
																	/>
																	{item.quantity}
																	<HiMinusSm
																		onClick={() => removeFromCart(item)}
																		className="border pointer"
																	/>
																</div>
															</td>
															<td className="px-6 py-4 text-black">
																{calculateItemPrice(item)}
															</td>
														</tr>
													</>
												);
											})}
											<tr className="dark:bg-primary-golden border-b dark:border-gray-700">
												<th
													scope="row"
													className="px-6 py-4 font-medium text-blackwhitespace-nowrap dark:text-white"
												></th>
												<td className="px-6 py-4"></td>
												<td className="px-6 py-4"></td>
												<td className="px-6 py-4 text-black">
													cart value: {calculateTotal()}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div className="max-w-sm mx-auto">
								<div className="mb-5">
									<label
										for="name"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
									>
										Your Name
									</label>
									<input
										type="text"
										onChange={(event) => setName(event.target.value)}
										id="name"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder="Please enter your name"
										required
									/>
								</div>
								<div className="mb-5">
									<label
										for="email"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Your email
									</label>
									<input
										type="email"
										onChange={(event) => setEmail(event.target.value)}
										id="email"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder="name@indiankebabs.com"
										required
									/>
								</div>
								<div className="mb-5">
									<label
										for="phone"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										Your Phone
									</label>
									<input
										type="text"
										onChange={(event) => setPhone(event.target.value)}
										id="phone"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										placeholder="+1 8xxxxxxxx"
										required
									/>
								</div>
							</div>
							<div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
								<button
									data-modal-hide="default-modal"
									onClick={checkOut}
									type="button"
									className="text-primary-golden  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-black hover:bg-slate-800"
								>
									checkout
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			<div
			className="overflow-y-auto"
				style={{
					backgroundImage: `url(${images.bg})`,
					height: '100vh' ,
					backgroundRepeat: 'repeat'
				}}>
					<div className="flex md:flex-row md:justify-center gap-3 overflow-x-scroll ml-2" style={{ '-ms-overflow-style': 'none', 'scrollbar-width': 'none' }}>
						{
							categories?.map((category) => {
								return (
									<>
										<Button className="bg-primary-golden hover:bg-black hover:text-white" onClick={() => setCat(category)} color="">{category}</Button>
									</>
								)
							})
						}		
					</div>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-5 px-3">
					{groupedMenu[cat].map((item) => {
						return (
							<>
								<div className="w-full max-w-sm  border border-gray-200 rounded-lg shadow bg-black dark:border-gray-700">
									<div className="px-5 pb-5">
										<p
											className="mb-1 font-CormorantUpright text-center font-semibold text-slate-100 dark:text-gray-400 "
											style={{ color: "#DCCA87" }}
										>
											{item.category}
										</p>
										<a href="#">
											<h5 className="text-xl font-CormorantUpright font-semibold tracking-tight text-slate-100 dark:text-white">
												{item.title}
											</h5>
											<p className="mb-3 font-CormorantUpright font-normal text-slate-100 dark:text-gray-400">
												{item.description}
											</p>
										</a>
										<div className="flex flex-col md:flex-row gap-2 items-center justify-between">
											<span className="text-3xl font-bold text-slate-100 dark:text-white">
												{item.price}
											</span>
											<button
												onClick={() => addToCart(item)}
												className="text-black hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-golden dark:hover:bg-orange-400 dark:focus:ring-blue-800"
											>
												Add to cart
											</button>
										</div>
									</div>
								</div>
							</>
						);
					})}
				</div>
			</div>
		</>
	);
}
