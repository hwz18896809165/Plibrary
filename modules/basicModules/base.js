class Base{
    constructor(tableName){
        this.tableName = tableName;
        this.id = this.SetColumn("int",20,true,null,true)
        this.creationTime = this.SetColumn("datetime",null,true)
        this.creatorUserId = this.SetColumn("int",20)
        this.lastUpdateUserId = this.SetColumn("int",20)
        this.primaryKey = "";
        this.foreignKey = {};
        this.index = {};
    }
    SetColumn(type,length,require = false,maxDecimalLength = null,autoNumber = false){
        return {
            type : type,
            length : length,
            require : require,
            maxDecimalLength : maxDecimalLength>=length?length:maxDecimalLength,
            autoNumber : autoNumber
        }
    }
    SetKeys(primaryKey,foreignKey = {},index = {}){
        this.primaryKey = primaryKey;
        this.foreignKey = foreignKey;
        this.index = index;
    }
}

module.exports = Base;