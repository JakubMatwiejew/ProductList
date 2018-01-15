import React from 'react';
import ReactDOM from 'react-dom';

document.addEventListener('DOMContentLoaded', function(){

    class SearchBar extends React.Component{
        render(){
            return(
                <div>
                    <p>Type text to find a product or choose a category.</p>
                    <form>
                        <input onChange={this.props.handleFilter} type="text" placeholder="Search..." />
                        <select onChange={this.props.handleOption}>
                            <option value={""}>All categories</option>
                            {this.props.productlist
                                .map(product =>
                                    <option value={product.category}>
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

    class Products extends React.Component {
        getFilteredProductsByName() {
            const filter = this.props.filter.toLowerCase();

            var filteredProducts = this.props.products.map(obj => {
                var filtered = Object.values(obj.products)
                    .filter(p => p.toLowerCase().indexOf(filter) > -1);
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
                    <div>
                        {this.getFilteredProductsByName()
                            .map((product, ind) =>
                                <div key={ind}>
                                    <h2>{product.category}</h2>
                                    {Object.values(product.products).map(name => <li>{name}</li>)}
                                </div>
                            )
                        }
                    </div>
                );
            } if(this.props.option!="") {
                return (
                    <div>
                        {this.getFilteredProductsByOption()
                            .map((product, ind) =>
                                <div key={ind}>
                                    <h2>{product.category}</h2>
                                    {Object.values(product.products).map(name => <li>{name}</li>)}
                                </div>
                            )
                        }
                    </div>
                );
            }
            return (
                <div>
                    {this.props.products
                        .map((product, ind) =>
                            <div key={ind}>
                                <h2>{product.category}</h2>
                                {Object.values(product.products).map(name => <li>{name}</li>)}
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
                option: ""
            };
        }
        handleFilter = (e) => {
            this.setState({ filterText: e.target.value });
        }
        handleOption = (e) => {
            this.setState({ option: e.target.value });
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
                <div>
                    <h1>Product list</h1>
                    <h2>Traditional food from Silesia</h2>
                    <SearchBar handleOption= { this.handleOption } filter={ this.state.filterText } handleFilter= { this.handleFilter } productlist={ this.state.productlist } />
                    <Products option={ this.state.option } filter={ this.state.filterText } products={ this.state.productlist }/>
                </div>
            )
        }
    }

    ReactDOM.render(
        <App/>,
        document.getElementById('app')
    );
});
