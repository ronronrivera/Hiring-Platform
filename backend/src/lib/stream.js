import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

if(!ENV.STREAM_API_SECRET || !ENV.STREAM_API_KEY){
    console.log("Stream API key or secret is missing");
}

export const streamServer = StreamChat.getInstance(
    ENV.STREAM_API_KEY,
    ENV.STREAM_API_SECRET
);
