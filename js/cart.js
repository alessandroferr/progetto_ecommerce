var products = {
	"jordan": {
		"id": "jordan",
		"name": "Jordan 1 Retro High OG",
		"image": "chicago_short.jpg",
		"price": 349.99
	},
	"zebra": {
		"id": "zebra",
		"name": "Adidas Yeezy Boost 350 V2",
		"image": "zebra_short.jpg",
		"price": 419.99
	},
};

// Creates an item object
function createItem ( id, taglia ) {
	var item = {};

	item.id = id;
	item.nome = products[ id ].name;
	item.image = products[ id ].image;
	item.taglia = taglia;
	item.prezzo = products[ id ].price;

	return item;
}

// Creates a cart item object that contains an item and its quantity
function createCartItem ( item, quant ) {
	var cartItem = {};

	cartItem.item = item;
	cartItem.quant = quant;
	cartItem.total = item.prezzo * quant;

	return cartItem;
};

function addProduct ( id, taglia = 0, quant = 1 ) {
	var item = createItem( id, taglia );
	cart.add( item, quant );
}

function updateProd ( id ) {
	cart.update( id, document.getElementById( 'prod_' + id ).value );
}

var cart = {
	// numero oggetti
	num: 0,

	// list of cart items
	items: [],

	// totale carrello
	total: 0,

	_calcTotal: function () {
		var total = 0;
		var num = 0;

		for ( var i = 0; i < this.items.length; i++ ) {
			total += this.items[ i ].total;
			num += this.items[ i ].quant;
		}

		this.total = total;
		this.num = num;

		// aggiorna il numero di oggetti nel carrello
		document.getElementById( 'carrello' ).innerHTML = this.num;

		// salva il carrello nel localStorage
		this.saveToLocalStorage();

		renderCart();
	},

	// aggiungi oggetto
	add: function ( item, quant = 1 ) {
		quant = parseInt( quant );

		// se l'oggetto è già presente nel carrello, incrementa la quantità
		for ( var i = 0; i < this.items.length; i++ ) {
			if ( this.items[ i ].item.id == item.id ) {
				this.items[ i ].quant += quant;
				this.items[ i ].total = this.items[ i ].item.prezzo * this.items[ i ].quant;

				this._calcTotal();
				return;
			}
		}

		// se l'oggetto non è presente nel carrello, crea un nuovo oggetto
		var cartItem = createCartItem( item, quant );

		this.items.push( cartItem );
		this._calcTotal();
	},

	update: function ( id, quant ) {
		quant = parseInt( quant );

		for ( var i = 0; i < this.items.length; i++ ) {
			if ( this.items[ i ].item.id == id ) {
				this.items[ i ].quant = quant;
				this.items[ i ].total = this.items[ i ].item.prezzo * this.items[ i ].quant;
			}
		}

		this._calcTotal();
	},

	remove: function ( id ) {
		console.log( "=== ELIMINA: ", id );
		for ( var i = 0; i < this.items.length; i++ ) {
			if ( this.items[ i ].item.id == id ) {
				this.num -= this.items[ i ].quant;
				this.items.splice( i, 1 );
			}
		}
		this._calcTotal();
	},

	saveToLocalStorage: function () {
		localStorage.setItem( 'cart', JSON.stringify( this.items ) );
	},

	loadFromLocalStorage: function () {
		var items = JSON.parse( localStorage.getItem( 'cart' ) );

		if ( items ) {
			this.items = items;
			this._calcTotal();
		}
	}
};

function floatToPrice ( num ) {
	return num.toFixed( 2 ).replace( '.', ',' );
}

function renderCart () {
	var prods = document.getElementById( 'prodotti' );

	if ( !prods ) return;

	if ( cart.items.length == 0 ) {
		prods.innerHTML = '<h2>Il carrello è vuoto</h2>';
		return;
	}

	var res = '<div class="row">';

	for ( var i = 0; i < cart.items.length; i++ ) {
		var table = '<table><tr><td width="1">';
		var it = cart.items[ i ];

		table += '<img src="/img/' + it.item.image + '" alt="' + it.item.nome + '" />';
		table += '</td><td valign="center"><h3>' + it.item.nome + '</h3></td>';
		table += '<td valign="center"><select class="form-select">';
		table += '<option >Seleziona taglia</option>';
		table += '<option value="1" ' + ( it.item.taglia == "1" ? "selected" : "" ) + '>EU 39 / US 6.5 / UK 6</option>';
		table += '<option value="2" ' + ( it.item.taglia == "2" ? "selected" : "" ) + '>EU 40 / US 7 / UK 6.5</option>';
		table += '<option value="3" ' + ( it.item.taglia == "3" ? "selected" : "" ) + '>EU 41 / US 8 / UK 7.5</option>';
		table += '<option value="4" ' + ( it.item.taglia == "4" ? "selected" : "" ) + '>EU 42 / US 8.5 / UK 8</option>';
		table += '<option value="5" ' + ( it.item.taglia == "5" ? "selected" : "" ) + '>EU 43 / US 9.5 / UK 9</option>';
		table += '<option value="6" ' + ( it.item.taglia == "6" ? "selected" : "" ) + '>EU 44 / US 10 / UK 9.5</option>';
		table += '<option value="7" ' + ( it.item.taglia == "7" ? "selected" : "" ) + '>EU 45 / US 11 / UK 10.5</option>';
		table += '<option value="8" ' + ( it.item.taglia == "8" ? "selected" : "" ) + '>EU 46 / US 12 / UK 11.5</option>';
		table += '</select></td>';
		table += '<td valign="center">&nbsp;<input id="prod_' + it.item.id + '" min="1" type="number" value="' + cart.items[ i ].quant + '" style="width: 3em" onchange="updateProd(\'' + it.item.id + '\')"/>';
		table += '<button onclick="cart.remove(\'' + it.item.id + '\')">Elimina</button></td>';
		table += '<td valign="center"><h3>€&nbsp;' + floatToPrice( cart.items[ i ].total ) + '</h3></td></tr></table>';

		res += table;
	}

	res += '</div>';

	prods.innerHTML = res;
}


window.onload = function () {
	cart.loadFromLocalStorage();
	renderCart();
};