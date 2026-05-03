## Iteration Description
In this iteration we greatly improved existing interface, enhancing user experience and making visuals more pleasant to look at. 

## Page list
## *Each of the pages has header and footer. Their functionality will be listed at the end of this section.
1. HomePage.jsx - The landing page of the site. Provides interactions for a new user who is not familiar with the site. Gives the main idea with a simple phrase and allows to pick a random dish/dish of the day or proceed to the recipe list page.

2. RecipeListPage.jsx - The center of the site. Has a big scrollable list of interactive recipes with each of them containing a list of ingredients required to cook it, along with the time needed to complete the recipe and a picture. Above the list are search field, filter (Diet/Added ingredients), and sort (Cooking time) options. On the left side of the page there is a "pantry" sidebar- it contains the list of all the ingredients available on the site with filters and search field for them. Pressing any ingredient will add it to the added ingredients section, there user can look through, delete one-by-one, or clear all ingredients at once. If user chose "Matches added ingredients" option, the list will show only recipes which are possible to cook using the ingredients user added to their pantry. 
Upon pressing on any recipe card, user will go to the RecipeDetailPage.

3. RecipeDetailPage.jsx - Page designed to give cooking instruction steps for one dish. Has only informational elements: The name of the dish along with the picture, underneath there are the main section with cooking steps and two sidebars one of which lists all the ingredients needed to cook the recipe and the other containts information about the recipe.

4. ProfilePage.jsx - User profile page. Contains information which user entered about themselves upon regestration along with the photo. There are two buttons "edit profile" and "log out".

5. RegisterPage.jsx - Page where user can enter their details necessary to create an account on the site. Has limitations on the different information the user can enter.

6. LoginPage.jsx - Page which user gets to when trying to enter their account after logging out.

7. AddRecipePage.jsx/EditRecipe.jsx - Pages used to add/edit recipes. Later would be accessible only for users with specific roles.

0. HEADER - Header is accessible from every page of the site and it has critical functionality embedded inside. It has 5 (excluding the add recipe button) interactive elements 3 of which are for the navigation (Home -> Homepage.jsx, RECIPEHUNTER -> RecipeListPage.jsx, Profile icon -> ProfilePage.jsx) and 2 are for accessibility (Language - English, Romanian, Ukrainian, Light/Dark - Light theme/ Dark theme).


The layout of the RecipeList page was influenced by the site supercook.com which has similar usage to our site. 
Whereas when it came down to overall design, we decided to go with hellofresh.com, since it still strongly touches recipes topic, has modern fresh look and not difficult to implement.

## Contribtion of each member during 3rd iteration
# Ivan Novik 
* Implemented and fixed pantry filtering functionality
* Added initial documentation for the 3rd iteration
* Improved UI navigation (home button and logo behavior)
* Added Ukrainian language support (translation + filtering/sorting updates)
* Enhanced sorting and filtering features
* Refactored and merged branches to keep the project up to date
* Improved UI/UX with styling updates, sticky header/pantry, and dark mode

# Andrei-Silviu Serianu
* Implemented the language function on the site.
* Continued to implement the translation functions on everything my colleagues did afterwards.
* Created the english and romanian translation.
* Fix major critical bug in the database involving the recipes.
* Fixed the footer.
* Fixed all the bugs related with the page transfers.


