function getText() {//recieves text from inventory and saves it as an array
	var textSplit = [];
	var txtFile = new XMLHttpRequest();
	txtFile.onreadystatechange = function() {
		if (txtFile.readyState == 4 && txtFile.status == 200) {
			var tempArray = txtFile.responseText.split("\n");//splits items based on new lines
			for (i = 0; i < tempArray.length; i++) {
				textSplit[i] = tempArray[i].split(",");//splits values and saves into array
			}
			items = textSplit;
			generateTable(items);
			localStorage.setItem("itemArray", JSON.stringify(items));//stores items into local storage
			for (i = 0; i < items.length; i++) {
				items[i][7] = 0;
			}
			localStorage.setItem("cartArray", JSON.stringify(items));//adds extra item count to the end for cart(resets on refresh)
		}
	};
	txtFile.open("GET", "inventory.txt", true);
	txtFile.send();
}

function sortAlpha(command) {
	var items = JSON.parse(localStorage.getItem("itemArray"));
	var modified = [];
	var count = 0;
	var sortArray = [];

	if (command == 0) {//default
		modified = items;
	} else {
		if (command == 1 || command == 2) {//sort by category
			for (i = 0; i < items.length; i++) {
				sortArray[i] = items[i][2];
			}
			sortArray.sort();
			if (command == 2) {
				sortArray.reverse();
			}
		} else if (command == 3 || command == 4) {//sort by company
			for (i = 0; i < items.length; i++) {
				sortArray[i] = items[i][3];
			}
			sortArray.sort();
			if (command == 4) {
				sortArray.reverse();
			}
		} else {//sort by item
			for (i = 0; i < items.length; i++) {
				sortArray[i] = items[i][1];
			}
			sortArray.sort();
			if (command == 6) {
				sortArray.reverse();
			}
		}
		var sortSet = new Set(sortArray);//makes the sortArray non-repetitive
		sortArray = Array.from(sortSet)//then puts it back into sortArray
		for (i = 0; i < sortArray.length; i++) {
			for (j = 0; j < items.length; j++) {
				if (sortArray[i] == items[j][1] || sortArray[i] == items[j][2] || sortArray[i] == items[j][3]) {
					modified[count] = items[j];
					count++;
				}
			}
		}
	}
	document.getElementById("table1").innerHTML = "";
	generateTable(modified);
}

function sortCat(command) {//sort by category
	var items = JSON.parse(localStorage.getItem("itemArray"));
	var modified = [];
	var count = 0;
	if (command == "default") {
		modified = items;
	} else {
		for (i = 0; i < items.length; i++) {
			if (items[i][2] == command) {
				modified[count] = items[i];
				count++;
			}
		}
	}
	document.getElementById("table1").innerHTML = "";
	generateTable(modified);
}

function selectCat() {//dynamically generates selector for sorting by category
	var items = JSON.parse(localStorage.getItem("itemArray"));
	for (i = 0; i < items.length; i++) {
		var catItem = items[i][2];
		var repeat = false;
		for (j = i + 1; j < items.length; j++) {//checks if category will be repeated
			if (items[j][2] == catItem) {
				repeat = true;
				break;
			}
		}
		if (!repeat) {
			var option = document.createElement("option");
			option.setAttribute('value', catItem);
			option.appendChild(document.createTextNode(catItem));
			document.getElementById("category").appendChild(option);
		}
	}
}

function sortComp(command) {//sort by company
	var items = JSON.parse(localStorage.getItem("itemArray"));
	var modified = [];
	var count = 0;
	if (command == "default") {
		modified = items;
	} else {
		for (i = 0; i < items.length; i++) {
			if (items[i][3] == command) {
				modified[count] = items[i];
				count++;
			}
		}
	}
	document.getElementById("table1").innerHTML = "";
	generateTable(modified);
}

function selectComp() {//dynamically generates selector for sorting by company
	var items = JSON.parse(localStorage.getItem("itemArray"));
	for (i = 0; i < items.length; i++) {
		var comItem = items[i][3];
		var repeat = false;
		for (j = i + 1; j < items.length; j++) {//checks if company will be repeated
			if (items[j][3] == comItem) {
				repeat = true;
				break;
			}
		}
		if (!repeat) {
			var option = document.createElement("option");
			option.setAttribute('value', comItem);
			option.appendChild(document.createTextNode(comItem));
			document.getElementById("company").appendChild(option);
		}
	}
}

function search() {
	var items = JSON.parse(localStorage.getItem("itemArray"));
	var input = document.getElementById("searchBar");//user input 
	var filter = input.value.toUpperCase();
	var modified = [];
	var count = 0;

	for (i = 0; i < items.length; i++) {//loop through all table rows, and hide those who don't match the search query
		var name = items[i][1].toUpperCase().indexOf(filter) > -1;
		var company = items[i][3].toUpperCase().indexOf(filter) > -1;
		var description = items[i][4].toUpperCase().indexOf(filter) > -1;
		if (name || company || description) {
			modified[count] = items[i];
			count++;
		}
	}
	document.getElementById("table1").innerHTML = "";
	generateTable(modified);
}

function generateTable(items) {
	for (i = 0; i < items.length; i++) {
		var tableRow = document.createElement("tr");//creates new row
		
		//image
		var imgCol = document.createElement("td");
		imgCol.setAttribute('width', '150');
		var itemImg = document.createElement("img");
		itemImg.setAttribute('src', items[i][6]);
		itemImg.setAttribute('alt', items[i][1]);
		itemImg.setAttribute('height', '100px');
		itemImg.setAttribute('width', '100px');
		imgCol.appendChild(itemImg);
		tableRow.appendChild(imgCol);
		
		//item name + descriptions
		var itemCol = document.createElement("td");
		itemCol.setAttribute('width', '400');
		var nameDiv = document.createElement("div");//create tag for name
		nameDiv.appendChild(document.createTextNode(items[i][1]));
		itemCol.appendChild(nameDiv);
		var productDiv = document.createElement("div");//create tag for company/category
		productDiv.appendChild(document.createTextNode(items[i][3] + ", " + items[i][2]));
		itemCol.appendChild(productDiv);
		var descriptionDiv = document.createElement("div");//create tag for description
		descriptionDiv.appendChild(document.createTextNode(items[i][4]));
		itemCol.appendChild(descriptionDiv);
		tableRow.appendChild(itemCol);
		
		//price
		var priceCol = document.createElement("td");
		priceCol.setAttribute('width', '100');
		priceCol.appendChild(document.createTextNode(items[i][5]));
		tableRow.appendChild(priceCol);

		//quantity + submit
		var submitCol = document.createElement("td");
		submitCol.setAttribute('width', '150');
		var input = document.createElement("input");//quantity input
		input.setAttribute('width', '150');
		input.setAttribute('id', items[i][0]);
		input.setAttribute('type', 'number');
		input.setAttribute('value', '0');
		input.setAttribute('step', '1');
		submitCol.appendChild(input);
		var button = document.createElement("button");//submit button
		button.setAttribute('class', 'addCart');
		button.setAttribute('value', items[i][0]);
		button.setAttribute('onclick', 'addCart(this.value)');
		button.appendChild(document.createTextNode("Add to Cart"));
		submitCol.appendChild(button);
		tableRow.appendChild(submitCol);

		document.getElementById("table1").appendChild(tableRow);
	}
}

function addCart(itemID) {
	var items = JSON.parse(localStorage.getItem("cartArray"));
	var itemValue = parseInt(document.getElementById(itemID).value);
	if (itemValue < 0) {//if quantity is negative
		alert("No takebacks!");
		document.getElementById(itemID).value = 0;
		return;
	} else if (itemValue > 100) {//if quantity goes over 100 units
		alert("Reached inventory limit");
		document.getElementById(itemID).value = 0;
		return;
	}
	for (i = 0; i < items.length; i++) {
		if (items[i][0] == itemID) {//if inventory will be more than 100 units
			if ((items[i][7] + itemValue) > 100) {
				alert("Reached inventory limit");
				document.getElementById(itemID).value = 0;
				return;
			}
			items[i][7] += parseInt(itemValue);
		}
	}
	document.getElementById(itemID).value = 0;
	localStorage.setItem("cartArray", JSON.stringify(items));//updates cart in local storage
	alert("Item(s) have been added to cart!");
}

function removeCart(itemID) {//removes item from cart
	if (!(confirm("Are you sure?\n(Action is permanent)"))) {
		return;
	}
	var items = JSON.parse(localStorage.getItem("cartArray"));
	for (i = 0; i < items.length; i++) {
		if (items[i][0] == itemID) {
			items[i][7] = 0;
		}
	}
	document.getElementById("table1").innerHTML = "";
	localStorage.setItem("cartArray", JSON.stringify(items));
	generateCart();
}

function clearCart() {
	if (!(confirm("Are you sure?\n(Action is permanent)"))) {
		return;
	}
	var items = JSON.parse(localStorage.getItem("cartArray"));
	for (i = 0; i < items.length; i++) {
		items[i][7] = 0;
	}
	document.getElementById("table1").innerHTML = "";
	localStorage.setItem("cartArray", JSON.stringify(items));
	generateCart();
}

function generateCart() {//generates cart from array in localStorage
	var original = JSON.parse(localStorage.getItem("cartArray"));
	var items = [];
	var count = 0;
	var total = 0;
	for (i = 0; i < original.length; i++) {
		if (original[i][7] != 0) {
			items[count] = original[i];
			count++;
		}
	}
	for (i = 0; i < items.length; i++) {
		var tableRow = document.createElement("tr");//creates new row

		//remove item
		var removeCol = document.createElement("td");
		var button = document.createElement("button");
		button.setAttribute('class', 'removeCart');
		button.setAttribute('value', items[i][0]);
		button.setAttribute('onclick', 'removeCart(this.value)');
		button.appendChild(document.createTextNode("x"));
		removeCol.appendChild(button);
		tableRow.appendChild(removeCol);

		//item name + category
		var itemCol = document.createElement("td");
		itemCol.setAttribute('width', '465')
		itemCol.appendChild(document.createTextNode(items[i][1] + " - " + items[i][2]));
		tableRow.appendChild(itemCol);

		//price
		var priceCol = document.createElement("td");
		priceCol.setAttribute('width', '100');
		priceCol.setAttribute('class', 'cartCol');
		var price = parseFloat(items[i][5].substring(1, 5));
		priceCol.appendChild(document.createTextNode(items[i][5]));
		tableRow.appendChild(priceCol);

		//quantity
		var quantityCol = document.createElement("td");
		quantityCol.setAttribute('width', '100');
		quantityCol.setAttribute('class', 'cartCol');
		var quantity = parseInt(items[i][7]);
		quantityCol.appendChild(document.createTextNode(items[i][7]));
		tableRow.appendChild(quantityCol);

		//subtotal
		var subtotalCol = document.createElement("td");
		subtotalCol.setAttribute('width', '100');
		subtotalCol.setAttribute('class', 'cartCol');
		var subtotal = (price * quantity).toFixed(2);
		total += parseFloat(subtotal);
		subtotalCol.appendChild(document.createTextNode("$" + subtotal));
		tableRow.appendChild(subtotalCol);

		document.getElementById("table1").appendChild(tableRow);
	}
	var tableRow = document.createElement("tr");//creates new row
	tableRow.setAttribute('class', 'cartTotal');

	//text
	var textCol = document.createElement("td");
	textCol.appendChild(document.createTextNode("Total: "));
	tableRow.appendChild(textCol);

	//value
	var valueCol = document.createElement("td");
	valueCol.appendChild(document.createTextNode("$" + total.toFixed(2)));
	tableRow.appendChild(valueCol);

	document.getElementById("table1").appendChild(tableRow);
	localStorage.setItem("totalPrice", total);
}

function confirmCheckout() {
    var formContent = document.getElementById("form");
    var firstName = formContent.elements[0].value;
    var lastName = formContent.elements[1].value;
    var email = formContent.elements[2].value;
    var address = formContent.elements[3].value;
    var city = formContent.elements[4].value;
    var province = formContent.elements[5].value
    if (firstName == "" || lastName == "" || email == "" || address == "" || city == "" || province == "") {
    	alert("You are missing some information!");
    } else {
    	alert("Thanks " + firstName + " " + lastName + "! We have sent an email to " + email + ", and we'll be sending your item(s) to " 
    	+ address + " at " + city + ", " + province + ". Payment will be recieved at time of delivery.");
    }
}

function checkoutTotal() {
	var grandTotal = JSON.parse(localStorage.getItem("totalPrice"));
	var display = document.getElementById("totalPrice");
	display.appendChild(document.createTextNode(" $" + (1.13 * grandTotal).toFixed(2)));
}