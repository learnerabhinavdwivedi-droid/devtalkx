import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";

const createSendEmailCommand = (toAddress, fromAddress) => {
    return new SendEmailCommand({
      Destination: {
        /* required */
        CcAddresses: [
          /* more items */
        ],
        ToAddresses: [
          toAddress,
          /* more To-email addresses */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: "<h1>This is the test email from html</h1>",
          },
          Text: {
            Charset: "UTF-8",
            Data: "This is the test format body",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Hello world from SES",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };
  
  const run = async () => {
    const sendEmailCommand = createSendEmailCommand(
      "itisameerkhan@gmail.com",
      "ameerkhan@ameerkhanproject.xyz",
    );
    
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  // snippet-end:[ses.JavaScript.email.sendEmailV3]
  export { run };