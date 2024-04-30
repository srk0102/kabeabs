import React, { useState, useEffect } from 'react'
import { Checkbox, Table } from "flowbite-react";

import Backendless from "backendless";

import { Navbar } from '../components'

export const Dasboard = () => {

	const [orders, setOrders] = useState([])

	useEffect(() => {
		const fetchData = async () => {
			try {
				Backendless.initApp(
					"8EFCA6F3-230D-6683-FFA9-ABAA6CB0E900",
					"F552546A-B35F-4F4B-8DC5-5089CBC9D476"
				);
				const orders = Backendless.Data.of("orders")

				const today = new Date(); // Get current date
				today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for the start of the day

				const queryBuilder = Backendless.DataQueryBuilder
					.create()
					.setPageSize(100)
					.setSortBy('created DESC') // Sort in descending order by 'created'
					.setWhereClause(`created >= ${today.getTime()}`); // Filter orders created today

				const response = await orders.find(queryBuilder);
				setOrders(response);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchData();
	}, []);

	const enableRealTime = async () => {
		Backendless.initApp(
			"8EFCA6F3-230D-6683-FFA9-ABAA6CB0E900",
			"F552546A-B35F-4F4B-8DC5-5089CBC9D476"
		);
		const orders = Backendless.Data.of("orders")

		const rtHandlers = orders.rt();

		rtHandlers.addCreateListener(order => {
			setOrders([...orders, order])
			console.log(order)
		});

		rtHandlers.addUpdateListener(order => {
			const ordersList = orders.map(m => m.objectId === order.objectId ? order : m);
			setOrders(ordersList)
		});

		rtHandlers.addDeleteListener(order => {
			const ordersList = orders.filter(m => m.objectId !== order.objectId);
			setOrders(ordersList)
		});
	}

	enableRealTime()

	console.log(orders)

	return (
		<>
			<div className="overflow-x-auto">
			<Navbar />
			<h1 className='mt-72 text-4xl mb-10 text-white bg-transparent'>Today: {new Date().toLocaleDateString('en-US')}</h1>
				<Table hoverable className='bg-transparent'>
					<Table.Head>
						<Table.HeadCell>S.No</Table.HeadCell>
						<Table.HeadCell>Order ID</Table.HeadCell>
						<Table.HeadCell>Date</Table.HeadCell>
						<Table.HeadCell>Name</Table.HeadCell>
						<Table.HeadCell>Email</Table.HeadCell>
						<Table.HeadCell>Phone</Table.HeadCell>
						<Table.HeadCell>Total</Table.HeadCell>
						<Table.HeadCell>Status</Table.HeadCell>
					</Table.Head>
					<Table.Body className="divide-y">
						{
							orders?.map((order, index) => {
								return (
									<>
										<Table.Row className="bg-transparent hover:bg-gray-700 hover:text-white cursor-pointer">
											<Table.Cell>{index + 1}</Table.Cell>
											<Table.Cell className='font-bold'>{order.orderid}</Table.Cell>
											<Table.Cell>{new Date(order.created).toLocaleDateString('en-US')}</Table.Cell>
											<Table.Cell>{order.name}</Table.Cell>
											<Table.Cell>{order.email}</Table.Cell>
											<Table.Cell>{order.phone}</Table.Cell>
											<Table.Cell>{order.total}</Table.Cell>
											<Table.Cell className={`rounded-md ${order.completed ? 'text-green-700 border border-green-700 font-medium text-sm px-5 py-2.5 text-center me-2 mb-2' : 'text-red-700 border border-red-700 font-medium text-sm px-5 py-2.5 text-center me-2 mb-2'}`}>{order.completed ? 'Compleated' : 'Pending'}</Table.Cell>
										</Table.Row>
									</>
								)
							})
						}
					</Table.Body>
				</Table>
			</div >
		</>
	)
}
