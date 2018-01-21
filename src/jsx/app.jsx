import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', function(){

    class SearchBar extends React.Component{
        constructor(props){
            super(props);
        }
        render(){
            return(
                <div>
                    <p>Type text to find a product or choose a category.</p>
                    <form>
                        <input disabled={this.props.disableOption} onChange={this.props.handleFilter} type="text" placeholder="Search..." />
                        <select disabled={this.props.disableFilter} onChange={this.props.handleOption}>
                            <option value={""}>All categories</option>
                            {this.props.productlist
                                .map(product =>
                                    <option key={product.category} value={product.category}>
                                        {product.category}
                                    </option>
                                )
                            }
                        </select>
                    </form>
                </div>
            )
        }
    }

    class ProductDescription extends React.Component {
        constructor(props){
            super(props);
            this.state={
                product: "Click name of the product/meal you want to read about...",
                recipe: "",
                image: ""
            }
        }
        componentWillReceiveProps(nextProps){
            if (nextProps.clickedProduct !== this.props.clickedProduct) {
                this.setState({
                    product: nextProps.clickedProduct,
                    recipe: nextProps.recipe,
                    image: nextProps.image
                });
            }
        }
        render(){
            return(
                <div id="recipee" className="box recipe">
                    <h2>Recipe</h2>
                    <p>{this.state.product}</p>
                    <div className="image" style={{backgroundImage: "url(" + this.state.image + ")", display: this.props.displayImage}}></div>
                    <p>{this.state.recipe}</p>
                    <button id="backToTop"><a href="#top">Back to product list</a></button>
                </div>
            )
        }
    }

    class Products extends React.Component {
        constructor(props){
            super(props);
        }
        getFilteredProductsByName() {
            const filter = this.props.filter.toLowerCase();

            var filteredProducts = this.props.products.map((obj) => {
                var filtered = Object.values(obj.products)
                    .filter(p => p[0].toLowerCase().indexOf(filter) > -1);
                if (filtered.length === 0) return null;
                return { ...obj, ...{ products: filtered } };
            })
                .filter(product => product);
            return filteredProducts;
        }
        getFilteredProductsByOption() {
            const option = this.props.option;

            var filteredCategory = this.props.products.map(obj => {
                if (obj.category === option) return obj;

                var filtered = Object.values(obj.products)
                    .filter(p => p.indexOf(option) > -1);

                if (filtered.length === 0) return null;
                return { ...obj, ...{ products: filtered } };
            })
                .filter(product => product);
            return filteredCategory;
        }
        render() {
            if(this.props.filter!="") {
                return (
                    <div id="top" className="box list">
                        {this.getFilteredProductsByName()
                            .map((product, ind) =>
                                <div key={ind}>
                                    <h2>{product.category}</h2>
                                    {Object.values(product.products).map(name => <li key={name}><a href="#recipee" onClick={this.props.handleClickedProduct(name)}>{name[0]}</a></li>)}
                                </div>
                            )
                        }
                    </div>
                );
            } if(this.props.option!="") {
                return (
                    <div id="top" className="box list">
                        {this.getFilteredProductsByOption()
                            .map((product, ind) =>
                                <div key={ind}>
                                    <h2>{product.category}</h2>
                                    {Object.values(product.products).map((name) => <li key={name}><a href="#recipee" onClick={this.props.handleClickedProduct(name)}>{name[0]}</a></li>)}
                                </div>
                            )
                        }
                    </div>
                );
            }
            return (
                <div id="top" className="box list">
                    {this.props.products
                        .map((product, ind) =>
                            <div key={ind}>
                                <h2>{product.category}</h2>
                                {Object.values(product.products).map((name) => <li key={name}><a href="#recipee" onClick={this.props.handleClickedProduct(name)}>{name[0]}</a></li>)}
                            </div>
                        )
                    }
                </div>
            )
        }
    }

    class App extends React.Component{
        constructor(props){
            super(props);
            this.state={
                productlist: [],
                filterText: "",
                option: "",
                clickedProduct: "",
                recipe: "",
                image: "",
                disableFilter: false,
                disableOption: false,
                displayImage: "none"
            };
        }
        handleFilter = (e) => {
            this.setState({ filterText: e.target.value });
            if(e.target.value.length != 0){
                this.setState({ disableFilter: true });
            } else {
                this.setState({ disableFilter: false });
            }
        }
        handleOption = (e) => {
            this.setState({ option: e.target.value });
            if(e.target.value != ""){
                this.setState({ disableOption: true });
            } else {
                this.setState({ disableOption: false });
            }
        }
        handleClickedProduct = (name) => (e) => {
            this.setState({
                clickedProduct: name[0],
                recipe: name[1],
                image: name[2],
                displayImage: "block"
            });
        }
        componentDidMount(){
            fetch('http://localhost:3000/products')
                .then(r => r.json())
                .then( data => {
                    this.setState({})
                    let products = Object.keys(data).map(id => data[id]);
                    this.setState({
                        productlist: products
                    })
                });
        }
        render(){
            return(
                <div className="wrapper">
                    <div className="nav" style={{backgroundImage: "url(./dist/img/nav.jpg)"}}>
                        <h1>Product list</h1>
                        <h2>Traditional food from Silesia</h2>
                        <SearchBar disableOption={ this.state.disableOption } disableFilter={ this.state.disableFilter } handleOption= { this.handleOption } filter={ this.state.filterText } handleFilter= { this.handleFilter } productlist={ this.state.productlist } />
                    </div>
                    <div className="full">
                        <Products handleClickedProduct= { this.handleClickedProduct } option={ this.state.option } filter={ this.state.filterText } products={ this.state.productlist }/>
                        <ProductDescription displayImage={ this.state.displayImage } image={ this.state.image } recipe={ this.state.recipe } clickedProduct={ this.state.clickedProduct }/>
                    </div>
                </div>
            )
        }
    }

    ReactDOM.render(
        <App/>,
        document.getElementById('app')
    );
});
