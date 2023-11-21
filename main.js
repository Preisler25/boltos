class Termek{
    constructor(nev, ar, kep){
        this.nev = nev;
        this.ar = ar;
        this.kep = kep;
    }

    builderKosar = (kosar, display) => {
        const card = newCard('bg-slate-800', 'flex-row', 'p-3');
        newDiv(this.nev, 'text-white', 'p-2', 'm-1', card);
        newDiv(this.ar + ' Ft', 'text-white', 'p-2', 'm-1', card);
        newBtn('Törlés', 'bg-orange-700', () => {kosar.popProduct(this);}, card);
        display.appendChild(card);
    };

    builder = (kosar, display, search_filter) => {

        if (search_filter != undefined) {
            if (this.nev.toLowerCase().indexOf(search_filter.toLowerCase()) == -1) {
                return;
            }
        }

        const card = newCard('bg-slate-800', 'flex-col', 'p-3');
        newDiv(this.nev, 'text-white', 'p-1', 'm-0', card);
        newDiv(this.ar + ' Ft', 'text-white', 'p-1', 'm-0', card);
        newImg('images/' + this.kep, this.nev, card);
        newBtn('Kosárba', 'bg-orange-700', () => {kosar.addProduct(this);}, card);

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

const newImg = (src, alt, card) => {
    const img = document.createElement('img');

    img.classList.add('rounded');
    img.classList.add('border-2');
    img.classList.add('border-gray-600');
    img.src = src;
    img.alt = alt;
    card.appendChild(img);
}

const newDiv = (text, color, p, m, card) => {
    const div = document.createElement('div');
    div.textContent = text;
    div.classList.add(p);
    div.classList.add(m);
    div.classList.add(color);
    card.appendChild(div);
}

const newBtn = (text, color, event, card) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.classList.add('p-2');
    btn.classList.add('rounded');
    btn.classList.add(color);
    btn.addEventListener('click', event);
    card.appendChild(btn);
}

const newCard = (color, flex_dir, p) => {
    const card = document.createElement('div');
    card.classList.add(p);
    card.classList.add('rounded');
    card.classList.add(color);
    card.classList.add('flex');
    card.classList.add(flex_dir);
    return card;
}

const display = document.querySelector('#kosar');
const display_termek = document.querySelector('#termékek_cont');
const ar_display = document.querySelector('#ar');

const search = document.querySelector('#kereso');

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

search.addEventListener('keyup', () => {
    termekLista.changeSearchFilter(search.value);
});


loadData(termekLista, kosar);