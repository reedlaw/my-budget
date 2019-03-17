import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as TransactionActions from "../../actions/transactionCollection";
import styles from "./TransactionCollection.css";
import Transaction from "../Transaction/Transaction";

class TransactionCollection extends Component<Props> {
    props: Props;

    constructor(){
        super();
        this.state = {
            note: "",
            amount: 0,
            day: 1,
            selectedCategory: "",
            selectedCategoryId: "",
            selectedItem: "",
            selectedItemId: ""
        }

        this.modifyNote = this.modifyNote.bind(this);
        this.modifyAmount = this.modifyAmount.bind(this);
        this.modifyDay = this.modifyDay.bind(this);
        this.modifyCategory = this.modifyCategory.bind(this);
        this.modifyItem = this.modifyItem.bind(this);        
        this.createNewTransaction = this.createNewTransaction.bind(this);
    }

    modifyNote(event){
        this.setState({
            note: event.target.value
        });
    }

    modifyAmount(event){        
        var newValue = event.target.value;
        if (newValue.match(/^(\d+)?\.?\d?\d?$/) !== null){
            this.setState({
                amount: newValue
            });
        }
    }

    modifyDay(event){
        this.setState({
            day: event.target.value
        });
    }

    modifyCategory(event){
        // find category
        var category = this.props.categories.find(c => c.dateId === this.props.date.id && c.name === event.target.value);
        
        var newCategoryId = (typeof category !== "undefined") ? category.id : "";

        // find item
        var item = "";
        var newItemId = "";
        if (this.props.items.length > 0){
            var exists = this.props.items.sort((a, b) => a.name > b.name).find(i => i.dateId === this.props.date.id && i.categoryId === newCategoryId);

            if (typeof exists !== "undefined"){
                item = exists.name;
                newItemId = exists.id;
            }
        }
        

        this.setState({
            selectedCategory: event.target.value,
            selectedCategoryId: newCategoryId,
            selectedItem: item,
            selectedItemId: newItemId 
        });
    }

    modifyItem(event){
        var item = this.props.items.find(i => i.dateId === this.props.date.id && i.categoryId === this.state.selectedCategoryId && i.name === event.target.value);

        if (typeof item !== "undefined"){
            this.setState({
                selectedItem: item.name,
                selectedItemId: item.id
            });
        } else {
            this.setState({
                selectedItem: "",
                selectedItemId: ""
            });
        }
    }

    createNewTransaction(event){
        this.props.addTransaction(this.state.selectedCategoryId, 
            this.state.selectedItemId, this.state.day, this.state.amount, this.state.note);

        this.setState({
            amount: 0,
            note: ""
        });
    }

    createCategoriesDropDown(){
        let categories = this.props.categories;
        return categories.filter(c => c.dateId === this.props.date.id).sort((a, b) => a.name > b.name).map((category) =>
            <option key={`${category.dateId}.${category.id}.${category.name}`}>{category.name}</option>
        );
    }

    createItemsDropDown(){
        let items = this.props.items;
        return items.filter(i => i.dateId === this.props.date.id && i.categoryId === this.state.selectedCategoryId).sort((a, b) => a.name > b.name).map((item) => 
            <option key={`${item.dateId}.${item.id}.${item.name}`}>{item.name}</option>
        );
    }

    render() {
        return (
            <React.Fragment>

                <form onSubmit={() => this.createNewTransaction()}>
                    <select value={this.state.selectedCategory} onChange={this.modifyCategory}>
                        <option value="">---</option>
                        {this.createCategoriesDropDown()}
                    </select><br />  
                    <select value={this.state.selectedItem} onChange={this.modifyItem}>
                        <option value="">---</option>
                        {this.createItemsDropDown()}  
                    </select>                 
                    <input type="number" placeholder="amount" value={this.state.amount} onChange={this.modifyAmount}></input><br />
                    <input type="text" placeholder="note" value={this.state.note} onChange={this.modifyNote}></input>
                    <input type="number" placeholder="day" min={1} max={31} value={this.state.day} onChange={this.modifyDay}></input>
                    <input type="submit" disabled={this.state.selectedCategory === "" || this.state.selectedItem === ""} value="Add">
                    </input>
                </form>


                {this.props.transactions.map((value, index, array) => {
                    return <div>"{value.note}" ${value.amount}</div>
                })}
            </React.Fragment>
        );
    }
}




function mapStateToProps(state){
    return {
        date: state.date,
        categories: state.categories,
        items: state.items,
        transactions: state.transactions
    }
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(TransactionActions, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionCollection);