// @ts-nocheck
import React, { useState } from "react";

export const App = () => {
  const [given, setGiven] = useState("");
  const [when, setWhen] = useState("");
  const [then, setThen] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { given, when, then };
    if (selectedItem) {
      const updatedItems = items.map((item) =>
        item === selectedItem ? { ...item, ...newItem } : item
      );
      setItems(updatedItems);
      setSelectedItem(null);
    } else {
      setItems([...items, newItem]);
    }
    setGiven("");
    setWhen("");
    setThen("");
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setGiven(item.given);
    setWhen(item.when);
    setThen(item.then);
  };

  const handleDelete = (item) => {
    const updatedItems = items.filter((i) => i !== item);
    setItems(updatedItems);
    setSelectedItem(null);
  };

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  function handleCopy() {
    const itemsString = JSON.stringify(items, null, 2);
    navigator.clipboard
      .writeText(itemsString)
      .then(() =>
        alert("Itens copiados para a área de transferência com sucesso!")
      )
      .catch((err) =>
        alert(`Erro ao copiar itens para a área de transferência: ${err}`)
      );
  }

  const colWidths = { given: 5, when: 4, then: 4 };

  items.forEach((item) => {
    Object.keys(item).forEach((key) => {
      const length = item[key].length;
      if (length > colWidths[key]) {
        colWidths[key] = length;
      }
    });
  });

  const table = [];
  table.push(
    `| ${pad("given", colWidths.given)} | ${pad(
      "when",
      colWidths.when
    )} | ${pad("then", colWidths.then)} |`
  );

  items.forEach((item) => {
    const row = `| ${pad(item.given, colWidths.given)} | ${pad(
      item.when,
      colWidths.when
    )} | ${pad(item.then, colWidths.then)} |`;
    table.push(row);
  });

  function pad(text, width) {
    return text.padEnd(width, " ");
  }

  const output = table.join("\n");

  return (
    <>
      <div className="flex">
        <div className="flex flex-1">
          <form onSubmit={handleSubmit} className="space-y-2">
            <label>
              Given:
              <input
                type="text"
                value={given}
                onChange={(e) => setGiven(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
              />
            </label>
            <label>
              When:
              <input
                type="text"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
              />
            </label>
            <label>
              Then:
              <input
                type="text"
                value={then}
                onChange={(e) => setThen(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
              />
            </label>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              {selectedItem ? "Atualizar" : "Enviar"}
            </button>
            {selectedItem && (
              <button type="button" onClick={() => setSelectedItem(null)}>
                Cancelar
              </button>
            )}
          </form>
        </div>

        <div className="flex flex-1 flex-col bg-slate-200 p-5 rounded-2xl">
          {items.map((item) => (
            <div
              key={JSON.stringify(item)}
              className="flex flex-row items-center"
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="w-8">
                {hoveredItem === item && (
                  <div>
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="flex rounded-3xl w-8 h-8 items-center justify-center"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="flex rounded-3xl w-8 h-8 items-center justify-center"
                    >
                      ❌
                    </button>
                  </div>
                )}
              </div>
              <pre>{JSON.stringify(item, null, 2)}</pre>
            </div>
          ))}
          <button onClick={handleCopy}>Copiar Itens</button>
        </div>
      </div>
      <pre>{output}</pre>
    </>
  );
};
