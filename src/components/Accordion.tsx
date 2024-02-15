import React, { useEffect, useState } from "react";
import type { CollapsePanelProps } from "antd";
import { Collapse, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
// const items: CollapsePanelProps[] = [
//   {
//     key: "1",
//     header: (
//       <div style={{ color: "white", border: "none", fontWeight: 900 }}>
//         This is panel header 1
//       </div>
//     ),
//   },
// ];

type BookContent = {
  [chapter: string]: {
    [section: string]: string;
  };
};

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const Accordion: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | string[] | undefined>(
    undefined
  );
  const [book, setBook] = useState<BookContent>({});
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchSummary = async (chapter: string, subChapter: string) => {
    try {
      setLoading(true);
      setSummary(null);
      const response = await fetch(
        `http://localhost:3000/summary/${chapter}/${subChapter}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLoading(false);
      setSummary(data.summary);
    } catch (error) {
      console.error("A problem occurred while fetching the summary.", error);
    }
  };

  const updateSummary = async (
    chapter: string,
    subChapter: string,
    newSummary: string | null
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/summary/${chapter}/${subChapter}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ summary: newSummary }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("A problem occurred while updating the summary.", error);
    }
  };

  const items: CollapsePanelProps[] = Object.keys(book).map((key: string) => {
    return {
      key: key,
      header: (
        <div style={{ color: "white" }}>
          {toTitleCase(key.replace(/_/g, " "))}
        </div>
      ),
      children: (
        <Collapse
          accordion
          bordered={false}
          expandIcon={({ isActive }) => (
            <img
              src="/assets/innerExpandIcon.png"
              width={20}
              style={{
                transform: `rotate(${isActive ? 90 : 0}deg)`,
                transition: "0.3s",
              }}
            />
          )}
        >
          {Object.keys(book[key]).map((chapter: string) => (
            <Collapse.Panel
              key={chapter}
              header={
                <p
                  className="text-white font-semibold text-sm flex items-center gap-2"
                  onClick={() => fetchSummary(key, chapter)}
                >
                  {toTitleCase(book[key][chapter])}
                </p>
              }
              style={{ border: "none" }}
            >
              <p
                contentEditable={!loading}
                className="text-white"
                onBlur={(e) =>
                  updateSummary(key, chapter, e.target.textContent)
                }
              >
                {loading ? (
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  />
                ) : (
                  summary
                )}
              </p>
            </Collapse.Panel>
          ))}
        </Collapse>
      ),
      style: { border: "none", fontWeight: 900, color: "white" },
    };
  });

  [
    {
      key: "1",
      header: <div style={{ color: "white" }}>This is panel header 1</div>,
      style: { border: "none", fontWeight: 900, color: "white" },
    },
  ];

  useEffect(() => {
    (async function fetchItems() {
      try {
        const response = await fetch(`http://localhost:3000/table-of-contents`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error("A problem occurred while fetching the data.", error);
      }
    })();
  }, []);

  const onCollapseChange = (key: string | string[]) => {
    setActiveKey(key);
  };

  return (
    <Collapse
      accordion
      onChange={onCollapseChange}
      activeKey={activeKey}
      expandIcon={({ isActive }) => (
        <img
          src="/assets/expandIcon.png"
          width={20}
          style={{
            transform: `rotate(${isActive ? 90 : 0}deg)`,
            transition: "0.3s",
          }}
        />
      )}
      bordered={false}
    >
      {items.map((item) => (
        <Collapse.Panel {...item} />
      ))}
    </Collapse>
  );
};

export default Accordion;
