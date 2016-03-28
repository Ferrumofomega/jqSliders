# jqSliders
This is a project containing a sample of self-editable sliders in jquery.


The page uses the url to determine its current location with respect to a series of pages. The "next" button at the bottom of some pages automatically creates a link to the next page based on the integer in the url name. So page1.html -> page2.html , monkey31.php -> monkey32.php

The sliders on the page have a common class "classSlider" to allow for dynamic functionality. The ID of the slider element (input element) and the labels and descriptions around them have a naming convention "data#Slider" with "Val" and "Descript" being some of the suffixes for the other elements. -"classSlider" is how each slider is identified in the document to be saved to cookies at the pressing of the "next" or "submit" button. -"Val" and "Descript" are both in the JS. "Val" is used in the first function called: onPageLoad(), and "Descript" is used in makeSliders() to properly position the "Reset to Initial Value" buttons. Obviously this is optional placement and the naming convention can be tossed. However, with respect to "Val," it is necessary only so the slider can have a place to print the value of the slider. An "always on tooltip" is also an option and can be used to get rid of the "Val" naming convention if you desire. -The format was based off the following plugin: https://github.com/seiyria/bootstrap-slider

The reset button at the top does nothing more than simply delete all the cookies stored in the current domain and re-initialize the sliders to a default value of (max+min)/2.

3.The "reset to initial value" button sets the slider to a value in the following order: i. See if there is a cookie with a name matching the ID of the current slider. ii. See if the slider has a "parent" attribute, and if that parent exists in the cookies. The parent will be the ID of another slider. iii. Set the slider to (max+min)/2

The "submit" button saves the current page's sliders into cookies, calls the processSliders() function, then the deleteAllCookies() function.

The cookies have a default value of 1 day. Note that you must run Chrome in the following way to allow for storing of cookies in the file:/// domain:

open /Applications/Google\ Chrome.app -n --args --enable-file-cookies