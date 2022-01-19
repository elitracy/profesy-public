const nodemailer = require("nodemailer");

const generateId = (length) => {
  var result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  sendEmail: function (emailAddress) {
    const id = generateId(4);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "profesyapp@gmail.com",
        pass: "Lefty(7518)",
      },
    });

    let mailOptions = {
      from: "et135202@gmail.com",
      to: emailAddress,
      subject: "Reset Password - Profesy",
      text: "Your code is: " + id,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error.response);
        return { code: "email fail" };
      } else {
        console.log("Email sent: " + info.response);
        return { code: id };
      }
    });
    return id;
  },
};
