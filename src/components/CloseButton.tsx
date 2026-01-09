import { CloseOutlined } from "@ant-design/icons";

interface CloseButtonProps {
    onClick: () => void;
}

const CloseButton = (props: CloseButtonProps) => {

    return (
        <button 
            className="menu-close"
            onClick={props.onClick}
            aria-label="Закрыть меню"
        >
            <CloseOutlined />
        </button>
    )
}

export default CloseButton;