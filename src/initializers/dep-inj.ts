const dI = ({
  Container,
  models,
}: {
  Container: any;
  models: { id: string; model: any }[];
}) => {
  try {
    models.forEach((m) => {
      Container.set(m.id, m.model);
    });
    return true;
  } catch (e) {
    throw new Error("Error in DI!");
  }
};

export default dI;
