let searchLogs = [];

const logSearch = (req, res) => {
  const { keyword } = req.body;
  if (keyword) {
    searchLogs.push({
      keyword,
      timestamp: new Date().toISOString()
    });
  }
  res.json({ success: true });
};

const getSearchLogs = () => searchLogs;

module.exports = { logSearch, getSearchLogs };
