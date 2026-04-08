import type { Context } from "hono";

interface Property {
    id: number;
    name: string;
    location: string;
    price: number;
}
// src/data/properties.ts
export const properties: Property[] = [
    { id: 1, name: "Sunny Apartment", location: "Kathmandu", price: 50000 },
    { id: 2, name: "Cozy Villa", location: "Pokhara", price: 120000 },
    { id: 3, name: "Modern Flat", location: "Lalitpur", price: 75000 },
    { id: 4, name: "Riverside Cottage", location: "Bhaktapur", price: 90000 },
    { id: 5, name: "Hilltop Mansion", location: "Nagarkot", price: 200000 },
    { id: 6, name: "Urban Studio", location: "Kathmandu", price: 45000 },
    { id: 7, name: "Lakeview Condo", location: "Pokhara", price: 95000 },
    { id: 8, name: "Mountain Retreat", location: "Ghandruk", price: 110000 },
    { id: 9, name: "City Center Loft", location: "Kathmandu", price: 85000 },
    { id: 10, name: "Quiet Bungalow", location: "Dhulikhel", price: 70000 },
];


export const getAllProperties = (c: Context) => {
    return c.json({ message: "Properties retrieved successfully", properties });
}

export const getPropertyById = (c: Context,) => {
    const id = Number(c.req.param("id"));
    const property = properties.find(prop => prop.id === id);
    if (!property) {
        return c.json({ error: "Property not found" }, 404);
    }
    return c.json({ message: "Property found", property });
}