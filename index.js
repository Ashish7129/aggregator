const express = require("express");
const app = express();
const port = 8080;
const request = require("request");
const user_source = process.env.USER_URL || "http://localhost:8081";
const order_source = process.env.ORDER_URL || "http://localhost:8082";

app.get("/orderdetails/:userId", (req, res) => {
  var userId = req.params.userId;
  console.log(`${user_source}/user/${userId}`);
  request(
    `${user_source}/user/${userId}`,
    { json: true },
    (err, resp, body) => {
      console.log(body);
      if (body == undefined) {
        res.send({
          error: "can't fetch user data"
        });
      }
      if (err || !body.name) {
        res.send({
          error: body.error,
          errorDesc: body.errorDescription
        });
      } else {
        console.log(`${order_source}/orders/${userId}`);
        request(
          order_source + "/orders/" + userId,
          { json: true },
          (err, resp, orderBody) => {
            console.log(orderBody);
            if (err || orderBody.orders.length == 0) {
              res.send("Error while getting order from " + order_source);
            } else {
              res.send({
                userDetails: {
                  name: body.name,
                  age: body.age,
                  email: body.email
                },
                orders: orderBody.orders
              });
            }
          }
        );
      }
    }
  );
});

app.use(express.static("public"));

app.listen(port, () =>
  console.log(`NAGP-aggregator app listening on port ${port}!`)
);
