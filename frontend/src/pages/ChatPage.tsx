import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { applicationStore } from "@/store/useApplicationStore";
import { toast } from "sonner";
import { useStore } from "@/store/useAuthStore";

export default function ChatPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useStore();

  const {
    connectToChat,
    streamClient,
    streamChannel,
    disconnectChat,
    chatLoading,
  } = applicationStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !profile) {
      navigate("/"); // protect route
      return;
    }

    const init = async () => {
      try {
        await connectToChat(applicationId!, { _id: user._id, name: user.name });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to open Chat Page");
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => disconnectChat(); // cleanup on unmount
  }, [applicationId]);

  if (loading || chatLoading) return <p>Loading chat...</p>;
  if (!streamClient || !streamChannel) return null;

  return (
    <Chat client={streamClient} theme="messaging light">
      <Channel channel={streamChannel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
}
