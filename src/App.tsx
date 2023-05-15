// @ts-nocheck
import React, { useState } from "react";

export const App = () => {
  const [json, setJson] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = event.target.elements.data.value;
    const rows = text.split("\n");
    const headers = rows.shift().split("\t");
    const data = rows.map((row) => {
      const values = row.split("\t");
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });
    setJson(data);
  };

  const colWidths = {};

  json.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!colWidths[key]) {
        colWidths[key] = key.length; // Define a largura inicial com o comprimento da chave
      }
      if (item[key]) {
        const length = item[key].length;
        if (length > colWidths[key]) {
          colWidths[key] = length; // Atualiza a largura se o valor for maior
        }
      }
    });
  });

  const table = [];
  const header = Object.keys(colWidths).map((key) => pad(key, colWidths[key]));
  table.push(`| ${header.join(" | ")} |`); // Cabeçalho da tabela

  json.forEach((item) => {
    const row = Object.keys(colWidths)
      .map((key) => pad(item[key] || "", colWidths[key]))
      .join(" | ");
    table.push(`| ${row} |`); // Linhas da tabela
  });

  function pad(text, width) {
    return (text || "").padEnd(width, " ");
  }

  const output = table.join("\n");

  function handleCopy({ copyType = "table" }) {
    const itemsString =
      copyType === "table" ? output : JSON.stringify(json, null, 2);
    navigator.clipboard
      .writeText(itemsString)
      .then(() =>
        alert("Itens copiados para a área de transferência com sucesso!")
      )
      .catch((err) =>
        alert(`Erro ao copiar itens para a área de transferência: ${err}`)
      );
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <br />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 htmlFor="data">Cole aqui os dados da planilha:</h1>
          <br />

          <textarea
            id="data"
            name="data"
            rows="6"
            cols="80"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
          ></textarea>
          <button
            type="submit"
            className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Transformar
          </button>
        </div>
      </form>

      <br />
      <hr />
      <br />

      <div>
        <button
          onClick={() => handleCopy({ copyType: "table" })}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Copiar Resultado em Tabela
        </button>
        <pre>{output}</pre>
      </div>

      <br />
      <br />

      <div>
        <button
          onClick={() => handleCopy({ copyType: "JSON" })}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Copiar Resultado em JSON
        </button>
        <pre>{JSON.stringify(json, null, 2)}</pre>
      </div>
    </>
  );
};
