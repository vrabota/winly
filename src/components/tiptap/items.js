const getSuggestionItems = ({ query, leadVariables }) => {
  return leadVariables
    .map(item => ({
      title: item,
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).insertContent(`{{${item}}}`).focus().run();
      },
    }))
    .filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 10);
};

export default getSuggestionItems;
