import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";

export const POST = async (req) => {
    mongoose.connect(process.env.MONGO_URL);
    const data = await req.json();
    const menuItemDoc = await MenuItem.create(data);
    return Response.json(menuItemDoc);
};

export const PUT = async (req) => {
    mongoose.connect(process.env.MONGO_URL);
    const {_id, ...data} = await req.json();
    await MenuItem.findByIdAndUpdate(_id, data);
    return Response.json(true);
};

export const GET = async () => {
    mongoose.connect(process.env.MONGO_URL);
    return Response.json(
        await MenuItem.find()
    )
};

export const DELETE = async (req) => {
    mongoose.connect(process.env.MONGO_URL);
    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');
    await MenuItem.deleteOne({_id});
    return Response.json(true);
}