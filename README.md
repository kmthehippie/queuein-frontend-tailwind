Queue In

What is this?
For now, it is a free queue application for restaurants or other businesses. You can grab and use the code if you think it's good enough for you and you are able to set it up for yourself.
I'm coding this as part of my practice and learning of web dev.

Trying it out?
If you do try out the code and have some feedback, you are free to contact me.
//_ Insert my email here for people to contact _//
I'd love to get better at coding and make the app better.

What are the features? (This app is still in development)

1. If there is a queue, it will display current customers in queue, queue status, estimated wait time, last updated (which should auto prompt every 60 seconds).
2. Once scanning the qr code, customer is taken to a page to fill their name, contact number and pax and a tick box of whether they would like to join the VIP. If they opt out, their contact number is erased within 24 hours. (This is to keep the customer's private details private)
3. Once in queue, customer can view their number in the queue, which number is currently being served, the estimated wait time, the last updated time, and a bar that indicates how many people is ahead of the customer.
4. On the account side: the host is greeted by the dashboard home page which displays all their outlets available on their account (Each restaurant may have multiple outlets). They click into their outlet, it should display a large Button to start queue and in lightly grayed out, the previous queue details.
5. If the user wants to start a queue, they should be greeted with a who are you pop up form. This should get the staffs name and password.
6. Once the queue has started, a qr code is generated for customers to join. This is the best way to isolate customers from joining the wrong queue as QR code is fresh every time.
   //To be iterated:
   (There may be an issue with printing a qr code every time, we will need to look into this flow again at a later period).
7. Once the queue has started, a table is created. The table that contains:
   Customer Queue Number | Time waited | Estimated Wait Time | PAX | Customer Name | Customer Phone Number | Status (contain 2 check box for each row, call or seated)
8. If customer is being called, the text in the check box changes to called. This would indicate the host has already called the customer either via phone, or verbally.
   //To be iterated
   Also, on call, the customer's phone should have sound effects and vibrations.
9. If the customer has been seated, the customer goes to the bottom of the list for future viewing. Everytime a new customer is added, it should be above the customers who are already seated. In the case a customer quits the queue, they also get moved to the bottom of the queue along with all the seated customers but with a red tint to indicate the customer has quit the queue. This way the store will know how many people have given up on waiting.
10. There is also an add customer (for host to manually add customers if they request) and an end queue button for the host. (This will allow the host to limit the number of customers and end the shift when necessary)
    The "End Queue" button should signify that the queue is no longer actively accepting new customers and is in a "winding down" state.
11. Next, the account also has access to settings which should also require user to "login". If the user has the permissions, they can access and change the settings. Here we want to allow users to change settings for each of their outlet.
    //To be iterated
    Settings for outlet include: default estimate wait time, location, googleMaps, wazeMaps, imgUrl, phone, hours. This information will be part of the "landing page" for this outlet for this account.
12. There should also be a customers page which collates all the customers into one page. It should contain name and number and only if VIP is true. If VIP is false, meaning the customers has opted out, their contact information should be deleted after 24 hours.
    //Note: I wonder if this would raise a lot of issues with multiple customers with the same name appearing in our database. To be reiterated upon at later point in time.
