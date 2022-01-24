class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  //! http://localhost:4000/api/v1/products?keyword=product1
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: 'i'
          }
        }
      : {};

    // console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }

  //! http://localhost:4000/api/v1/products?keyword=product1&category=Laptop
  //! http://localhost:4000/api/v1/products?keyword=product1&price[gte]=1200&price[lt]=2000
  filter() {
    const queryCopy = { ...this.queryStr };
    // console.log(queryCopy);

    //! Removing some fields for category
    const removeFields = ['keyword', 'page', 'limit'];

    removeFields.forEach(key => delete queryCopy[key]);

    //! Filter for price and rating
    // console.log(queryCopy);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // console.log(queryStr);

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

export default ApiFeatures;
