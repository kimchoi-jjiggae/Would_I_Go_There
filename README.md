# What's On The Other Side of the World?

People are familiar with what's going on in the neighborhood around us -- what currency is in use, what country we're in, perhaps the coffee shop nearest to our home. But how much do we know about what's going on on the opposite side of the world? Imagine you were to dig a whole straight through the earth. Would you _really_ end up in China?

Using this *[tool]*(https://kimchoi-jjiggae.github.io/Would_I_Go_There/), you can find out!

## Where'd You Land?
Try inputting your home location and see where that hole drops you off. Sometimes you'll land in a foreign country -- you'll get to see some facts about the region. But after a couple tries, notice anything interesting?

Most of the time, you land smack in the middle of an ocean! That's because 71% of the earth's surface is covered in water. This project increases users' awareness of how critical ocean health is for our planet by reminding them that no matter where they live, they likely inhabit an area that is antipodal (exactly opposite) from one of the earth's 5 oceans. By presenting interesting facts about marine life after demonstrating to users how frequently they land in the ocean, we hope to encourage users to take personal efforts towards environmental conservation of their antipodal aquatic neighbors.

## Technical Implementation
### APIs
We used the following API's to source the data rendered in this project:

1. **Google Maps**: To render the user's current and antipodal location

2. **Geo Appify**: To convert the user's address into a latitude and longitude, and to use reverse geocoding to determine the country of the antipodal location

3. **API-Ninjas Country**: To pull demographic data about the country of the user's antipodal location

4. **Open Weather Map**: To pull weather data about the antipodal location

5. **Github hosted marine life API**: We created a JSON file and uploaded it onto a Github repository that we then fetch from. This makes the data publicly accessible for other developers, without us needing to host the data within this project's repo or hosting via a local server.

### Event Listeners
We leveraged the following event handlers to make the app interactive:
1. **"resize"**: Mobile-friendly rendering is critical, since ~50% of browser sessions occur on the phone. We therefore change the DOM based on the size of the screen, for example by using a square splash image on a narrow desktop screen or phone, and a rectangular one on desktop.

2. **"submit"**: We parse the value of the user's input upon submission of their address, to pass along to functions that render relevant data about the antipodal location (e.g. map display, demographic data)

3. **"click"**: We keep track of the number of times a user clicks the affordance to re-input an address in order to update the flow of the page based on the data they have already seen. More on this below! We also added the ability to change the temperature scale between fahrenheit and celsius. More on this below!

4. **"DOMContentLoaded"**: To add interactive javascript to modify elements after the initial set of elements rendered.

### Interactive User Flow Logic
By counting the number of times that users click on the button that redirects them to the address form, we could change the user flow. To ensure users do not get discouraged and drop off after landing in the ocean a few times, we show them different messages depending on how many times they've landed in water. The first time they land in water, we show them data about nearby marine life. 

For future iterations, we redirect them to more holistic data about oceans and explain to them why they land in water more often than they might expect. Likewise, we shorten the interactive components of the experience (autoscrolling) after their first address input to decrease latency of the experience. 
