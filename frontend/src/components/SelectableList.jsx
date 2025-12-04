import styles from '../styles/SelectableList.module.css';

const SelectableList = ({ data, labelKey, valueKey, onSelect }) => {
    
    const handleItemClick = (item) => {
        const selectedValue = item[valueKey];
        
        if (onSelect) {
            onSelect(item);
        }
    };

    if (!data || data.length === 0) {
        return <div className={styles.popupNoData} >No options available.</div>;
    }

    return (
        <ul className={styles.popupList}>
            {data.map((item, index) => (
                <li 
                    key={item[valueKey] || index} 
                    className={styles.popupListItem}
                    onClick={() => handleItemClick(item)}
                >
                    {item[labelKey]}
                </li>
            ))}
        </ul>
    );
};

export default SelectableList;