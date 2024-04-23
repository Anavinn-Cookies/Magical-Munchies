document.addEventListener('DOMContentLoaded', function() {

    // Fetch all products when the page loads
    if (window.location.pathname.includes('SearchPage.html')) {
        fetchAllProducts()
    }
    


    // Function to fetch all products from the server
    function fetchAllProducts() {
        fetch('http://localhost:3000/api/products') // Assuming backend server runs on port 3000
            .then(response => response.json())
            .then(products => updateOutput(products))
            .catch(error => console.error('Error fetching products:', error));
    }

    // Function to handle button click event
    function getResponse() {
        const nameValue = document.getElementById('name_value').value;
        const flavorValue = document.getElementById('flavor_value').value;
        const priceStart = document.getElementById('price_start').value;
        const priceEnd = document.getElementById('price_end').value;

        let url = `http://localhost:3000/api/search?`;

        // Construct the URL with parameters based on the provided values
        if (nameValue.trim() !== '') {
            url += `name=${nameValue}&`;
        }
        if (flavorValue.trim() !== '') {
            url += `flavor=${flavorValue}&`;
        }
        if (priceStart.trim() !== '' && priceEnd.trim() !== '') {
            url += `start=${priceStart}&end=${priceEnd}`;
        } else if (priceStart.trim() !== '') {
            url += `start=${priceStart}`;
        } else if (priceEnd.trim() !== '') {
            url += `end=${priceEnd}`;
        }
        console.log(url);
        // Fetch data based on the constructed URL
        fetch(url)
            .then(response => response.json())
            .then(products => {
                updateOutput(products);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                updateOutput([]);
            });
    }

    // Function to update output div with fetched data
    function updateOutput(products) {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';
        if (Array.isArray(products) && products.length > 0) {
            products.forEach(product => {
                const productBox = document.createElement('div');
                productBox.className = 'product-box';
                productBox.innerHTML = `
                    <p>Product ID: ${product.ProductID}</p>
                    <p>Name: ${product.Name}</p>
                    <p>Price: ${product.Price}</p>


                    <img id="section-image" src="..${product.PhotoPath}">


                `;
                // Add event listener to each product box
                productBox.addEventListener('click', () => {
                    // Redirect to the product details page
                    window.location.href = `../html/product-details.html?id=${product.ProductID}`;
                });
                outputDiv.appendChild(productBox);
            });
        } else {
            const productBox = document.createElement('div');
            productBox.className = 'product-not-found';
            productBox.innerHTML = `<p>No product found</p>`;
            outputDiv.appendChild(productBox);
        }
    }

    // Add event listener to search button
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', getResponse);
    } else {
        console.error('Search button not found');
    }




    fetchProductDetails();
    

    // product detail
    function fetchProductDetails() {

        // Extract the product ID from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        console.log(productId+" At script")
        // Fetch product details from the server using the product ID
        fetch(`http://localhost:3000/api/product-details?id=${productId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(product => {
                // Call function to update the product details in the HTML
                updateProductDetails(product);
            })
            .catch(error => {
                console.error('Error fetching product details:', error);
            });
    }

    // Function to update the HTML with the fetched product details
    function updateProductDetails(product) {
        console.log(product)
        // Check if the array contains any items
        if (product.length > 0) {
            // Get the first item (assuming there's only one item in the array)
            const firstProduct = product[0];
    
            const productDetailsContainer = document.getElementById('product-details');
    
            
            const productPicElement = productDetailsContainer.querySelector('.product-picture')
            productPicElement.src = `..${firstProduct.PhotoPath}`;

            // Update product name
            const productNameElement = productDetailsContainer.querySelector('.product-name');
            productNameElement.textContent = `Name: ---${firstProduct.Name}---`;
    
            // Update product price
            const productPriceElement = productDetailsContainer.querySelector('.product-price');
            productPriceElement.textContent = `Price: ${firstProduct.Price}`;
    
            // Update product detail
            const productDetailElement = productDetailsContainer.querySelector('.product-detail');
            productDetailElement.textContent = `Detail: ${firstProduct.Detail}`;
    
            // Update other product details similarly if needed
        } else {
            console.error('Product array is empty');
        }
    }
    
    


});
