const searchStore = document.querySelector('.searchStore');
const storeItemsElement = document.querySelector('.storeItems');
const btnPrev = document.querySelector('#Prev');
const btnNext = document.querySelector('#Next');
const AddToCart = document.querySelector('#AddToCart');
const checkoutTbl = document.querySelector('#checkoutTbl');
const allChkBoxes = document.getElementsByClassName("chkBox");
const totalCostTD = document.querySelector('#total-cost');
const Checkout = document.querySelector('#Checkout');

// Get the modal
const modal = document.querySelector('#myModal');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

let storeItems = [];

let addToCart = [];

let page = 1;

let template = `
    {{#each storeItems}}
    <div class="storeItems" >
       <table class="storeTable" >
         <tr>
             <td colspan="2" ><span>{{this.title}}</span></td>
         </tr>
         <tr>
             <td><img src={{this.image}} alt="{{this.title}}" height="500" width=750"></td>
             <td valign = "top" > 
                 <table border="1" class="tableDesc" >
                    <tr>
                        <td>Material: <span>{{this.material}}</span></td>  
                    </tr>
                    <tr>
                        <td>Description: <span>{{this.description}}</td>
                    </tr>  
                    <tr>
                        <td>Color: <span>{{this.color}}</span></td>
                    </tr>
                    <tr>
                        <td>Price: $<span>{{this.price}}</span></td>
                    </tr>
                    <tr>
                        <td>Buy: <input type="checkbox" name="Item" value="{{this.title}}" data-price="{{this.price}}" class="chkBox"></td>
                    </tr>
                 </table>
             </td>
         </tr>
      </table>  
    </div>
    {{/each}}
`;

/**
 * Renders the template with the given data.
 * @param context The date to render.
 */
function render(context) {
  let compiled = Handlebars.compile(template);
  storeItemsElement.innerHTML = compiled(context);
}

function searchStoreHandler(event) {

  // Get the value from the searchElement
    let val = this.value;
    let filteredStoreItems = [];
    storeItems = [];

    $.ajax({
        url: 'http://5ceb36a60c871100140bf873.mockapi.io/v1/item', success: function (data) {

            // For each storeItem in the data
            for (let storeItem of data) {
                storeItems.push(storeItem);
            }

            //In the  filter function storeItems are filtered by title, and search is case insensitive
            filteredStoreItems = storeItems.filter(function (storeItm) {
                return storeItm.title.toLowerCase().indexOf(val.toLowerCase()) !== -1;
             });

            let dataNew = {
                storeItems: filteredStoreItems
            };

            render(dataNew);
        },
        error: function (xhr) {
            console.log("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
}

function makeAjaxRequest(url) {
    $.ajax({
        url: url, success: function (data) {

            // For each storeItem in the data
            for (let storeItem of data) {
                storeItems.push(storeItem);
            }

            let dataNew = {
                storeItems: storeItems
            };

            render(dataNew);
        },
        error: function (xhr) {
            console.log("An error occured: " + xhr.status + " " + xhr.statusText);
        }
    });
}

makeAjaxRequest("http://5ceb36a60c871100140bf873.mockapi.io/v1/item?page=1&limit=10");

function btnPrevHandler(event) {
    btnPrev.disabled = false;
    btnNext.disabled = false;

    page--;
    let url = "http://5ceb36a60c871100140bf873.mockapi.io/v1/item?page=" + page + "&limit=10";

    if (page > 0) {
        this.disabled = false;
        storeItems = [];
        makeAjaxRequest(url);
    }
    else {
        this.disabled = true;
    }

    if (page == 0) {
        page++;
    }
}

function btnNextHandler(event) {

    btnPrev.disabled = false;
    btnNext.disabled = false;
    page++;
    let url = "http://5ceb36a60c871100140bf873.mockapi.io/v1/item?page=" + page + "&limit=10";

    if (page < 11) {
        this.disabled = false;
        storeItems = [];
        makeAjaxRequest(url);
    }
    else {
        this.disabled = true;
    }

    if (page == 11) {
        page--;
    }
}

function remove(index) {
    checkoutTbl.deleteRow(index);
}

function addToCartHandler(event) {

    modal.style.display = "block";

    let i = 0, j = 0;
    let totalCost = 0.00;

    // Clear table
    checkoutTbl.innerHTML = "";

    // Clear the cart
    addToCart = [];

    for (i = 0; i < allChkBoxes.length; i++) {
        if (allChkBoxes[i].checked) {
            
            // Create an empty <tr> element and add it to the 1st position of the table:
            let row = checkoutTbl.insertRow(-1);

            // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);

            // Add some text to the new cells:
            cell1.innerHTML = "<td>" + allChkBoxes[i].value + "</td>";
            cell2.innerHTML = "<td>$" + parseFloat(allChkBoxes[i].getAttribute("data-price")) + "</td >";
            cell3.innerHTML = "<td><button type='button' class='removeBtn' onclick='remove(" + j + ")'>Remove</button></td>";

            // Calculate the total cost by adding the total cost to the checkbox price
            
            totalCost = totalCost + parseFloat(allChkBoxes[i].getAttribute("data-price"));

            let strItem = { title: allChkBoxes[i].value, price: allChkBoxes[i].getAttribute("data-price") };

            addToCart.push(strItem);

            // Keep track of the position of the added item to the cart
            j++;

        }
    }
   
    totalCostTD.innerText = "$" + totalCost;

}

function checkOutHandler(event) {
    if (checkoutTbl.rows.length > 0) {

        addToCart = [];

        alert("The checkout was successful");

        window.location = "index.html";
    }
    else {
        alert("Your cart is empty");
    }
}


// Add an event listener to the searchElement
searchStore.addEventListener('input', searchStoreHandler);

// Add a button click event for the btnPrev button
btnPrev.addEventListener('click', btnPrevHandler);

// Add a button click event for the btnNext button
btnNext.addEventListener('click', btnNextHandler);

// Add a button click event for the  AddToCart button
AddToCart.addEventListener('click', addToCartHandler);

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

Checkout.addEventListener('click', checkOutHandler);
