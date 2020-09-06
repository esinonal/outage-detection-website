# outage-detection-website

This project was for Professor Charlie Catlett at Array of Things. AoT is a project in the city of Chicago, which collects real-time data on the urban environment. Some of their sensors were not collecting data at certain times, so this project was in order to get insight as to where and when. Each node reports usually around every 30-40 seconds, but longer than this is seen as an outage.

I take in a csv file, a minimum outage duration in minutes, and then output a list of affected nodes. For each node, I show the start time and duration of the outage. At the bottom, I show two Vega Lite visualizations: number of outages per node, and total duration of the outages per node (in seconds).

I separated all of the code into parts that served different purposes: Main.elm, DataDecoding.elm, OutageDetection.elm, Visualization.elm. Vegalite was very easy to use in the end, and it was the data processing and error handling parts that proved to take a lot more time. 

I do a lot to prevent errors. I prevent the user from inputting anything other than an integer for the outage duration. I forced only csv files to be able to be uploaded. Also, the csv file has to be an AoT csv file (ie, has the right columns), and has no missing data items in the rows. Pic3 shows what happens when you upload a csv file that is not an Array of things csv file, or if one of the rows has a missing data item in it. ("Upload error")

Timestamps proved difficult to do in Elm, but thankfully combining several packages I was able to get something that served my needs. Another challenge was that the data file itself was very long. There was multiple reports per second, so this made looking through the file a computationally expensive process, and as a result it's slow (32 seconds for the Daily data - though there are Weekly and Monthlies too).

I'm also attaching the output of the program for a Daily csv files at different outage levels. Pic1 shows the outage level of (at least) 1 minute, while Pic2 shows the outage level of 3 minutes on the same file (which then only picks up a single outage.)

Since I used Vegalite, I was building with "elm make --output=elm.js --optimize Main.elm", the contents of which I put into the build.sh file.

I was originally planning to make my application fetch the csv file from the AoT website, after the user inputted the particular file they wanted, but in the end this proved to be a bit difficult, and I wanted to concentrate my efforts more on getting the application working well itself.
