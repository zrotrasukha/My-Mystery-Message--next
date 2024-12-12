import { Message } from "@/model/User";

export interface ApiResponseType {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
  // message field is for the time when we would want to show all the collected messages in the response
}
