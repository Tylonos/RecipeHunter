## Iteration Description
In this iteration we greatly improved existing interface, enhancing user experience and making visuals more pleasant to look at. 

## Page list
## *Each of the pages has header and footer. Their functionality will be listed at the end of this section.
1. HomePage.jsx - The landing page of the site. Provides interactions for a new user who is not familiar with the site. Gives the main idea with a simple phrase and allows to pick a random dish/dish of the day or proceed to the recipe list page.

2. RecipeListPage.jsx - The center of the site. Has a big scrollable list of interactive recipes with each of them containing a list of ingredients required to cook it, along with the time needed to complete the recipe and a picture. Above the list are search field, filter (Diet/Added ingredients), and sort (Cooking time) options. On the left side of the page there is a "pantry" sidebar- it contains the list of all the ingredients available on the site with filters and search field for them. Pressing any ingredient will add it to the added ingredients section, there user can look through, delete one-by-one, or clear all ingredients at once. If user chose "Matches added ingredients" option, the list will show only recipes which are possible to cook using the ingredients user added to their pantry. 
Upon pressing on any recipe card, user will go to the RecipeDetailPage.

3. RecipeDetailPage.jsx - Page designed to give cooking instruction steps for one dish. Has only informational elements: The name of the dish along with the picture, underneath there are the main section with cooking steps and two sidebars one of which lists all the ingredients needed to cook the recipe and the other containts information about the recipe.

4. ProfilePage.jsx - User profile page. Contains information which user entered about themselves upon regestration along with the photo. There are two buttons "edit profile" and "log out".

5. 