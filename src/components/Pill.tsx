export default function Pill({text,onRemove}:{text:string;onRemove?:()=>void}) {
  return (
    <span className="bg-indigo-200 dark:bg-indigo-700 text-indigo-900 dark:text-indigo-100 px-2 py-1 rounded-full text-xs mr-1 inline-flex items-center">
      {text}
      {onRemove && <button onClick={onRemove} className="ml-1">×</button>}
    </span>
  );
}
