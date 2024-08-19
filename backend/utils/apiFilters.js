class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const copyQueryStr = { ...this.queryStr };

    const removeItem = ["keyword", "page"];
    removeItem.forEach((item) => delete copyQueryStr[item]);

    // Advance filter for price, ratings, etc.
    let queryStr = JSON.stringify(copyQueryStr);
    queryStr = queryStr.replace(
      /\b(gt|lt|gte|lte|eq)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
