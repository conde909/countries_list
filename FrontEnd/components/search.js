class Search extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback () {
        this.innerHTML = 
`<div id="container_search" class="container_search">
    <div class="search_div">
        <input id="search_country_id" type="text" placeholder="Search">
        <span id="search_country_button_id" class="material-icons search_span">search</span>
    </div>
</div>
`
    }

}

window.customElements.define('search-aca', Search);