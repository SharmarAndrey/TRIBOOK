it('should return the list of apartments if we make a GET request to /api/apartments', async () => {
	const url = "http://localhost:3000/api/apartments";

	const response = await fetch(url);
	const data = await response.json();

	expect(response.ok).toBe(true);
	expect(response.status).toBe(200);
	expect(data.message).toBe("Query executed successfully");
	expect(data.results.length).toBeGreaterThan(0);
});

it('should return only one apartment if we make a GET request to /api/apartments with limit=1 in the query string', async () => {
	const url = "http://localhost:3000/api/apartments?limit=1";

	const response = await fetch(url);
	const data = await response.json();

	expect(response.status).toBe(200);
	expect(data.message).toBe("Query executed successfully");
	expect(data.results).toHaveLength(1);
});

it('should return an error if we make a GET request to /api/apartments with a wrong limit value', async () => {
	const url = "http://localhost:3000/api/apartments?limit=-7";

	const response = await fetch(url);
	const data = await response.json();

	expect(response.ok).toBe(false);
	expect(response.status).toBe(400);
	expect(data.message).toBe("'limit' must be a positive number.");
	expect(data).not.toHaveProperty("results");
});
