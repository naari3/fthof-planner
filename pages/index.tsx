import Head from "next/head";

export default function Home() {
  return (
    <section className="h-screen w-4/5 max-w-5xl mx-auto flex items-center justify-center flex-col">
      <h1 className="mb-4 text-green-500 text-3xl">サンプル</h1>
      <p className="mb-2">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        blanditiis consequatur eius hic ipsam nostrum omnis optio! Doloribus
        quaerat quis ratione? At, maiores voluptas? Eveniet odio omnis
        repellendus sapiente voluptatibus.
      </p>
      <button className="btn">a</button>
      <table className="table-auto border-collapse w-full">
        <thead>
          <tr className="rounded-lg text-sm font-medium text-gray-700 text-left bg-gray-200">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Author</th>
            <th className="px-4 py-2">Views</th>
          </tr>
        </thead>
        <tbody className="text-sm font-normal text-gray-700">
          <tr className="hover:bg-gray-100 border-b border-gray-200 py-10">
            <td className="px-4 py-4">Intro to CSS</td>
            <td className="px-4 py-4">Adam</td>
            <td className="px-4 py-4">858</td>
          </tr>
          <tr className="hover:bg-gray-100 border-b border-gray-200 py-4">
            <td className="px-4 py-4 flex items-center">
              A Long and Winding Tour
            </td>
            <td className="px-4 py-4">Adam</td>
            <td className="px-4 py-4">112</td>
          </tr>
          <tr className="hover:bg-gray-100  border-gray-200">
            <td className="px-4 py-4">Intro to JavaScript</td>
            <td className="px-4 py-4">Chris</td>
            <td className="px-4 py-4">1,280</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
