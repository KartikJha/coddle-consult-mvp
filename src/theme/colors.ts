export const colors = {
    background: '#FFF9F0', // Cream/Beige
    textPrimary: '#2E2365', // Dark Navy
    textSecondary: '#666680', // Greyish Purple
    primaryAction: '#FF6B6B', // Salmon Red
    secondaryAction: '#FFFFFF', // White
    systemBubble: '#E8E8FF', // Lavender
    userBubble: '#D0F0F0', // Mint/Cyan
    progressStep: '#5B67F7', // Royal Blue
    border: '#F0F0F0',
    white: '#FFFFFF',
    shadow: '#000000',
    success: '#4CAF50',
    error: '#FF5252',
};

export const theme = {
    colors,
    borderRadius: {
        card: 20,
        button: 30, // Pill shape
    },
    typography: {
        header: {
            fontSize: 28,
            fontWeight: 'bold' as 'bold',
            color: colors.textPrimary,
        },
        subHeader: {
            fontSize: 18,
            color: colors.textSecondary,
            lineHeight: 26,
        },
        button: {
            fontSize: 18,
            fontWeight: '600' as '600',
        }
    }
};
