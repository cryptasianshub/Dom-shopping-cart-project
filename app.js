let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listproductHTML = document.querySelector('.listProduct');
//to put the shopping cart list on html through the list cart class
let listCartHTML = document.querySelector('.listCart');
//to update the span tag of the total number of items in the cart
let iconCartSpan = document.querySelector('.icon-cart span');

let listProducts =[];

//variablecart to store cart value
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

const addDataToHTML = () => {
    listproductHTML.innerHTML = '';
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');

            //to identify what product to select with theadd to cart button
            newProduct.dataset.id = product.id;

            newProduct.innerHTML = `
            <img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">$${product.price}</div>
            <button class="addCart">
                Add To Cart
            </button>
            `;
            listproductHTML.appendChild(newProduct);
        })
    }
}
//to click on the add to cart button and get aresponse
listproductHTML.addEventListener('click', (event) =>{
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})
const addToCart = (product_id) => {
    //to find out if an itemis already in the cart we use find index to check its position in the cart and if its not found itll return the value -1 (see else below)
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    //if the current shopping cart list is empty
    if(carts.length <= 0){
        //then itll be easier the main shopping cart is by product id and its quantity is 1
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
        //if theres already data in the shopping cart then therell be two cases which is either the product is in the cart or not and to check if it is we use find index to find its position in the cart(above)
        //if the product is not in the cart the search position is less than 0
        }else if(positionThisProductInCart < 0){
            //then we use push to add the product id to the end of the cart variable array
            carts.push({
                product_id: product_id,
                quantity: 1
            });
            //but if it already exists in the cart then we increase the position of the product we just found in the shopping cart by 1
            } else {
                carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
    }
    //to display the shopping carton the screen we use the addcarttohtml function
    addCartToHTML()
    console.log(carts);

    //for otems to be saved even when users put their computer off we use a function addcartto memory to handle saving to memory
    addCartToMemory();
}
//addcart to memory 
const addCartToMemory= ()=>{
    //with the setitem function we can save the items in the cart into loocal storage
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    //to update the total number of items in the cart we create a variable with the value being 0
    let totalQuantity = 0;

    //if the number of items in the shopping cart is greater than zero
    if(carts.length > 0){
        //we use foreach to get the cartlist 
        carts.forEach(cart => {
            // then we add the 0 to the product quantity
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');

            //to determine which productid will be passed into quantity 
            //it is the same as adding products to the cart
            //for each item in the cart we create an id dataset with a coresponding product_id value
            newCart.dataset.id = cart.product_id;

            //to find the location of the product whose id is equal too the product id of the cart usiing the findindex function 
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];

            //get the items from html and commentit out on html
            newCart.innerHTML = `
            <div class="image">
            <img src="${info.image}" alt="">
        </div>
        <div class="name">
            ${info.name}
        </div>
        <div class="totalprice">
            $${info.price * cart.quantity}
        </div>
        <div class="quantity">
            <span class="minus"> - </span>
            <span>${cart.quantity}</span>
            <span class="plus"> + </span>
        </div>
            `;

            //then add it to listcart with appendchild
            listCartHTML.appendChild(newCart)
        })
    }
    //to finally display it on the screen we...
    iconCartSpan.innerText = totalQuantity;
}

//for when the plus and minus option to take effect in the cart we catch the event when the user clicks on the list cart by
listCartHTML.addEventListener('click',(event) => {
    //the we let the event target be to location where the user clicked
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        
        //to get the information we have to call the parent element twice to get the id information because it is inside the btnclass and classbtn is inside the classitem 
        //meaning it is located inside two layers
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        console.log(product_id);

        //to determine if it should add or decrease the amount we create a type variable with a default value of minus
        let type = 'minus';

        //but if the button clicked is a plus button then the type will be plus
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }

        //then we call the function changequantity
        changeQuantity(product_id, type);
    }

})
//this is the function changequantity
const changeQuantity = (product_id, type) => {
//then we need to find the postiin of the product in the cart with findindex
let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
if(positionItemInCart >= 0){
    switch (type) {
        // so if type has a value of plus then we need to add  the quantity to the value at that position
        case 'plus':
            carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
            break;
    //but if it is minus then then we need to see what the result is after subtracting 1
        default:
            let valueChange = carts[positionItemInCart].quantity - 1;

            //if it is higher than 0 we just subtract as usual
            if(valueChange> 0){
                carts[positionItemInCart].quantity = valueChange;

                //if the value is 0 then we have to delete the item with the splice function
            }else{
                carts.splice(positionItemInCart, 1);
            }
            break;
    }
}
//then run the addcarttomemory function again so it updates the latest data into memory
addCartToMemory();
//then run the addtohtml function to refresh the data on the screen
addCartToHTML();
}

const initApp = () =>{
    //get data from json
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        listProducts = data;
        
        //toshow the data on your html website
        addDataToHTML();

        //get cart from memory everytime a user uses the website after getting a product information itll continue to check the cart information in memory
        if(localStorage.getItem('cart')){
            //if it exists then our cart variable is equal to cart data in memory using json.parse function
            carts = JSON.parse(localStorage.getItem('cart'));
            //then run the function addcartto html to put the data on the screen
            addCartToHTML();
        }



        console.log(listProducts);
    })
}
initApp();