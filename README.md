Queue In

What is this?
This is a simple queue app I made. The app can be used in Restaurants (when it gets busy), Cafes (food collection when ready), Clinics (for when patients have to wait in a first in first served system) and any other basic queues.
The functions are not overtly complex. It is just a simple queue app meant to replace your conventional pen and paper.
My goals are to keep the functions simple for everyone -- you, your staff, and your customers AND to keep minimize invasiveness. 


Trying it out?
If you do try out the code and have some feedback, you are free to contact me.
dk.queuein@gmail.com
I'd love to get better at coding and make the app better.

What are the features? (This app is still in development)

1. If there is a queue, it will display current customers in queue, queue status, estimated wait time, last updated (which should auto prompt every 60 seconds).
2. Once scanning the qr code, customer is taken to a page to fill their name, contact number and pax and a tick box of whether they would like to join the VIP. They can easily do the same using the kiosk view if you have a spare phone or tablet lying around. If they opt out, their contact number is erased within 24 hours. 
3. Once in queue, customer can view their number in the queue, which number is currently being served, the estimated wait time, the last updated time, and a bar that indicates how many people is ahead of the customer.
4. On the account side: the host is greeted by the dashboard home page which displays all their outlets available on their account (Each business may have multiple outlets). They click into their outlet, they can see their previous queue details and a way to create a new queue or the existing queue.
5. If the user wants to start a queue, they should be greeted with a who are you pop up form. This should get the staffs name and password.
6. Once the queue has started, they can open up a kiosk view which customers can use to enter the queue.
7. If customer is being called, the text in the check box changes to called. This would indicate the host has already called the customer either via phone, or verbally.
   //To be iterated
   Also, on call, the customer's phone should have sound effects and vibrations.
8. If the customer has been seated, the customer goes to the bottom of the list for future viewing. Everytime a new customer is added, it should be above the customers who are already seated. In the case a customer quits the queue, they also get moved to the bottom of the queue along with all the seated customers but with a red tint to indicate the customer has quit the queue. This way the store will know how many people have given up on waiting.
9. There is also an add customer (for host to manually add customers if they request) and an end queue button for the host. (This will allow the host to limit the number of customers and end the shift when necessary)
    The "End Queue" button should signify that the queue is no longer actively accepting new customers and is in a "winding down" state.
10. Next, the account also has access to settings which should also require user to "login". If the user has the permissions, they can access and change the settings. Here we want to allow users to change settings for each of their outlet.
    //To be iterated
    Settings for outlet include: default estimate wait time, location, googleMaps, wazeMaps, imgUrl, phone, hours. This information will be part of the "landing page" for this outlet for this account.
11. There should also be a customers page which collates all the customers into one page. It should contain name and number and only if VIP is true. If VIP is false, meaning the customers has opted out, their contact information should be deleted after 24 hours.
    //Note: I wonder if this would raise a lot of issues with multiple customers with the same name appearing in our database. To be reiterated upon at later point in time.
