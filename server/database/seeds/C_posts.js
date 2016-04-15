exports.seed = function (knex, Promise) {
	return Promise.join(
		// Deletes ALL existing entries
		knex('posts').del(),

		// Inserts seed entries
		knex('posts').insert({
			user_id: 1,
			category: 2,
			timestamp: "02:31:00PM",
			dish_name: "White Mushroom Pizza",
			rest_name: "Unit D Pizzeria",
			rest_city: "Austin",
			yelp_id: "unit-d-pizzeria-austin",
			price: 16,
			picture_path: "/pictures/mushroom_pizza.jpg",
			veggie: true,
			gluten_free: false,
			spicy: false,
			rating: 4
		}),
		knex('posts').insert({
			user_id: 3,
			category: 3,
			timestamp: "02:32:00PM",
			dish_name: "Hoedeopbap- Sashimi Bibimbap",
			rest_name: "Hanabi",
			rest_city: "Austin",
			yelp_id: "hanabi-austin",
			price: 15,
			picture_path: "/pictures/hoedeopbap.jpg",
			veggie: false,
			gluten_free: true,
			spicy: false,
			rating: 5
		}),
		knex('posts').insert({
			user_id: 3,
			category: 1,
			timestamp: "02:35:00PM",
			dish_name: "Green Chile Queso",
			rest_name: "Torchy's Tacos",
			rest_city: "Austin",
			price: 5,
			picture_path: "/pictures/green_chile_queso.jpg",
			veggie: true,
			gluten_free: true,
			spicy: true,
			rating: 5
		}),
		knex('posts').insert({
			user_id: 2,
			category: 2,
			timestamp: "02:36:00PM",
			dish_name: "Double Cheese Burger",
			rest_name: "Shake Shack",
			rest_city: "Austin",
			price: 8,
			picture_path: "/pictures/shake_shack.jpg",
			veggie: false,
			gluten_free: false,
			spicy: false,
			rating: 4
		}),
		knex('posts').insert({
			user_id: 1,
			category: 4,
			timestamp: "02:37:00PM",
			dish_name: "Brick Toast",
			rest_name: "TeaHaus",
			rest_city: "Austin",
			price: 6,
			picture_path: "/pictures/brick_toast.jpg",
			veggie: true,
			gluten_free: false,
			spicy: false,
			rating: 5
		}),
		knex('posts').insert({
			user_id: 3,
			category: 3,
			timestamp: "02:38:00PM",
			dish_name: "Tonkotsu Original Ramen",
			rest_name: "Ramen Tatsu Ya",
			rest_city: "Austin",
			price: 9,
			picture_path: "/pictures/ramen.jpg",
			veggie: false,
			gluten_free: false,
			spicy: true,
			rating: 5
		}),
		knex('posts').insert({
			user_id: 2,
			category: 4,
			timestamp: "07:30:00PM",
			dish_name: "Carrot Ginger Cayenne Power Up",
			rest_name: "JuiceLand",
			rest_city: "Austin",
			price: 11,
			picture_path: "/pictures/carrot.jpg",
			veggie: true,
			gluten_free: true,
			spicy: true,
			rating: 3
		}),
		
		knex('posts').insert({
			user_id: 3,
			category: 1,
			timestamp: "08:30:00PM",
			dish_name: "Carne Asada Tacos",
			rest_name: "King Taco",
			rest_city: "Austin",
			price: 7,
			picture_path: "/pictures/tacos.jpg",
			veggie: false,
			gluten_free: false,
			spicy: false,
			rating: 5
		})
	);
};