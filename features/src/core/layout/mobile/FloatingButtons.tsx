import ActionButton from "react-native-action-button-warnings-fixed";

export interface FloatingButton {
    title: string,
    icon: JSX.Element,
    disable?: boolean;
    color: string,
    onClick: () => void
}

interface FloatingButtonsProps {
    active?: boolean;
    actions: FloatingButton[]
}

export function FloatingButtons({ active = true, actions } : FloatingButtonsProps){
    
    if(actions.length === 0)
        return null;

    if(actions.length === 1) {
        const action = actions[0];
        return (
            <ActionButton 
                aria-label={action.title}
                buttonColor={action.disable ? "rgba(212,212,212,1)" : action.color}
                onPress={() => !action.disable && action.onClick()} 
                renderIcon={() => action.icon}
            />
        );
    }
    
    return (
        <ActionButton buttonColor="#0ea5e9" active={active} autoInactive={false} backgroundTappable={true}>
            {actions.map((x, i) => (
                <ActionButton.Item 
                    key={i}
                    buttonColor={x.disable ? "rgba(212,212,212,1)" : x.color}
                    title={x.title} 
                    onPress={() => !x.disable && x.onClick()} 
                >
                    {x.icon}
                </ActionButton.Item>
            ))}
        </ActionButton>
    );
}