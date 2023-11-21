class Termek{
    constructor(nev, ar, kep){
        this.nev = nev;
        this.ar = ar;
        this.kep = kep;
    }

    builderKosar = (kosar, display) => {
        const card = newCard(['bg-slate-800', 'flex', 'flex-row', 'rounded', 'm-1', 'justify-end']);
        newDiv(this.nev, ['text-white', 'p-1', 'm-2'], card);
        newDiv(this.ar + ' Ft', ['text-white', 'p-1', 'm-2'], card);
        newBtn('Törlés', ['bg-orange-700', 'p-2', 'm-1', 'rounded'], () => {kosar.popProduct(this);}, card);
        display.appendChild(card);
    };

    builder = (kosar, display, search_filter) => {

        if (search_filter != undefined) {
            if (this.nev.toLowerCase().indexOf(search_filter.toLowerCase()) == -1) {
                return;
            }
        }

        const card = newCard(['bg-slate-800', 'flex', 'flex-col', 'p-3', 'rounded']);
        newDiv(this.nev, ['text-white', 'p-1', 'm-0'], card);
        newDiv(this.ar + ' Ft', ['text-white', 'p-1', 'm-0'], card);
        newImg('images/' + this.kep, this.nev, ['w-20', 'rounded', 'm-auto'], card);
        newBtn('Kosárba', ['bg-orange-700', 'p-2', 'm-1', 'rounded'], () => {kosar.addProduct(this);}, card);

        display.appendChild(card);
    };
}
class TermekLista{
    constructor(display){
        this.display = display;
        this.search_filter = '';
        this.termekLista = [];
    }

    addTermek(termek){
        this.termekLista.push(termek);
    }

    changeSearchFilter(search_filter){
        this.search_filter = search_filter;
        this.builder(kosar);
    }

    builder(kosar){
        this.display.innerHTML = '';
        for(let i = 0; i < this.termekLista.length; i++){
            this.termekLista[i].builder(kosar, this.display, this.search_filter);
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

const loadData = (termekLista, kosar) => {
    const data = fetch('./data.json').then((response) => {
        return response.json();
    }
    ).then((data) => {
        for (let i = 0; i < data.termekek.length; i++) {
            const termek = new Termek(data.termekek[i].nev, data.termekek[i].ar, data.termekek[i].kep);
            termekLista.addTermek(termek);
        }
        termekLista.builder(kosar);
    });
};

const newImg = (src, alt, styles, card) => {
    const img = document.createElement('img');

    img.src = src;
    img.alt = alt;

    for (let i = 0; i < styles.length; i++) {
        img.classList.add(styles[i]);
    }

    card.appendChild(img);
}

const newDiv = (text, styles, card) => {
    const div = document.createElement('div');
    div.textContent = text;
    
    for (let i = 0; i < styles.length; i++) {
        div.classList.add(styles[i]);
    }

    card.appendChild(div);
}

const newBtn = (text, styles, event, card) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    
    for (let i = 0; i < styles.length; i++) {
        btn.classList.add(styles[i]);
    }

    btn.addEventListener('click', event);
    card.appendChild(btn);
}

const newCard = (styles) => {
    const card = document.createElement('div');
    for (let i = 0; i < styles.length; i++) {
        card.classList.add(styles[i]);
    }
    return card;
}

const display = document.querySelector('#kosar');
const display_termek = document.querySelector('#termékek_cont');
const ar_display = document.querySelector('#ar');

const add_btn = document.querySelector('#manu_add');
const manu_name = document.querySelector('#manu_nev');
const manu_price = document.querySelector('#manu_ar');

const search = document.querySelector('#kereso');

const pay_btn = document.querySelector('#pay');
const del_btn = document.querySelector('#del');


const kosar = new Cart(display, ar_display);
const termekLista = new TermekLista(display_termek);


add_btn.addEventListener('click', () => {
    if (manu_name.value == '' || manu_price.value == '') {
        alert('Nem adtál meg minden adatot!');
        return;
    }
    
    if (isNaN(parseInt(manu_price.value))) {
        alert('Az ár nem szám!');
        manu_price.value = '';
        return;
    }
    const termek = new Termek(manu_name.value, parseInt(manu_price.value), 'default.jpg');
    termekLista.addTermek(termek);
    termekLista.builder(kosar);
    manu_name.value = '';
    manu_price.value = '';
});

pay_btn.addEventListener('click', () => {
    kosar.pay();
});

del_btn.addEventListener('click', () => {
    kosar.del_all();
});

search.addEventListener('keyup', () => {
    termekLista.changeSearchFilter(search.value);
});


loadData(termekLista, kosar);