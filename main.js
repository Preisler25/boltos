class Termek{
    constructor(nev, ar, kep){
        this.nev = nev;
        this.ar = ar;
        this.kep = kep;
    }

    builderKosar = (kosar, display) => {
        const card = document.createElement('div');
        const card_name = document.createElement('div');
        const card_price = document.createElement('div');
        const del_btn = document.createElement('button');

        del_btn.addEventListener('click', () => {
            kosar.popProduct(this);
        });

        del_btn.textContent = 'Törlés';
        card_name.textContent = this.nev;
        card_price.textContent = this.ar + ' Ft';
        card.appendChild(card_name);
        card.appendChild(card_price);
        card.appendChild(del_btn);

        display.appendChild(card);
    };

    builder = (kosar, display) => {
        const card = document.createElement('div');
        const card_name = document.createElement('div');
        const card_price = document.createElement('div');
        const img = document.createElement('img');
        const btn = document.createElement('button');

        btn.addEventListener('click', () => {
            kosar.addProduct(this);
        });
        btn.textContent = 'Kosárba';

        card_name.textContent = this.nev;
        card_price.textContent = this.ar + ' Ft';
        img.src = 'images/' + this.kep;
        img.alt = this.nev;
        card.appendChild(card_name);
        card.appendChild(card_price);
        card.appendChild(img);
        card.appendChild(btn);
    
        display.appendChild(card);
    };
}
class TermekLista{
    constructor(display){
        this.display = display;
        this.termekLista = [];
    }

    addTermek(termek){
        this.termekLista.push(termek);
    }

    builder(kosar){
        for(let i = 0; i < this.termekLista.length; i++){
            this.termekLista[i].builder(kosar, this.display);
        }
    }
}
class Cart {
    constructor(display, ar_display) {
        this.display = display;
        this.ar_display = ar_display;
        this.products = [];
    }

    addProduct(product) {
        this.products.push(product);
        ar_display.textContent = this.calculateTotal();
        this.builder(this.display);
    }

    popProduct(product) {
        this.products.pop(product);
        ar_display.textContent = this.calculateTotal();
        this.builder(this.display);
    }

    calculateTotal() {
        let total = 0;
        for (let i = 0; i < this.products.length; i++) {
            total += this.products[i].ar;
        }
        return total;
    }

    del_all() {
        this.products = [];
        ar_display.textContent = this.calculateTotal();
        this.builder(this.display);
    }

    pay() {
        alert('Köszönjük a vásárlást!');
        this.del_all();
    }

    builder() {
        this.display.innerHTML = '';
        for (let i = 0; i < this.products.length; i++) {
            this.products[i].builderKosar(this, this.display);
        }
    };
}

const loadData = (termekLista) => {
    const data = fetch('./data.json').then((response) => {
        return response.json();
    }
    ).then((data) => {
        for (let i = 0; i < data.termekek.length; i++) {
            const termek = new Termek(data.termekek[i].nev, data.termekek[i].ar, data.termekek[i].kep);
            termekLista.addTermek(termek);
        }
    });
};

const display = document.querySelector('#kosar');
const display_termek = document.querySelector('#termékek_cont');
const ar_display = document.querySelector('#ar');

const pay_btn = document.querySelector('#pay');
const del_btn = document.querySelector('#del');


const kosar = new Cart(display, ar_display);
const termekLista = new TermekLista(display_termek);

pay_btn.addEventListener('click', () => {
    kosar.pay();
});

del_btn.addEventListener('click', () => {
    kosar.del_all();
});

const termek1 = new Termek('Termék 1', 1000, '1.jpg');
const termek2 = new Termek('Termék 2', 2000, '2.jpg');
const termek3 = new Termek('Termék 3', 3000, '3.jpg');


loadData(termekLista);

termekLista.addTermek(termek1);
termekLista.addTermek(termek2);
termekLista.addTermek(termek3);

termekLista.builder(kosar);